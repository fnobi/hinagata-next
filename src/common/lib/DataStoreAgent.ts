import { compact } from "~/common/lib/array-util";

// NOTE: client/server両方の DocumentSnapshot<T, DocumentData> を満たす型
export type DocumentSnapshotMock<T> = {
  id: string;
  ref: { path: string };
  data: () => T | undefined;
};

// NOTE: client/server両方の DocumentReference<T, DocumentData> を満たす型
type DocumentReferenceMock = {
  id: string;
};

type QuerySnapshotMock<T> = {
  docs: DocumentSnapshotMock<T>[];
};

export type TypedCollectionList<T> = { id: string; data: T }[];

type TypedCollectionGroupList<T> = {
  fullPath: string;
  ids: string[];
  data: T;
}[];

export type DataStoreScheme<
  T,
  D extends string,
  C extends string | never = never
> = {
  name: string;
  documentKey: D;
  parse: (src: unknown) => T;
  parentCollection?: DataStoreScheme<unknown, C, never>;
};

const collectionPathFromParent = <T, D extends string, C extends string>(
  s: DataStoreScheme<T, D, C>,
  o: Record<D | C, string>
): string[] => [
  ...(s.parentCollection
    ? collectionPathFromParent<unknown, C, never>(s.parentCollection, o)
    : []),
  s.name,
  o[s.documentKey]
];

const calcCollectionPath = <D extends string, C extends string>(
  s: DataStoreScheme<unknown, D, C>,
  m: Record<C, string>
) =>
  [
    ...(s.parentCollection
      ? collectionPathFromParent(s.parentCollection, m)
      : []),
    s.name
  ].join("/");

type WhereFilterOp =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "array-contains-any"
  | "not-in";

type OrderByDirection = "asc" | "desc";

export type QueryFormula<T> =
  | ["where", keyof T, WhereFilterOp, unknown]
  | ["equal", keyof T, unknown]
  | ["orderBy", keyof T, OrderByDirection]
  | ["limit", number];

export abstract class DataStoreAgent<
  T extends {},
  D extends string,
  C extends string | never,
  Dr extends DocumentReferenceMock,
  Cr
> {
  public readonly scheme: DataStoreScheme<T, D, C>;

  public constructor(scheme: DataStoreScheme<T, D, C>) {
    this.scheme = scheme;
  }

  public get converter(): {
    toFirestore: (d: T) => T;
    fromFirestore: (s: DocumentSnapshotMock<Object>) => T;
  } {
    return {
      toFirestore: (d: T) => d,
      fromFirestore: s => this.scheme.parse(s.data())
    };
  }

  private calcCollectionParam(opts: Record<C, string>) {
    return {
      collectionPath: calcCollectionPath(this.scheme, opts)
    };
  }

  private calcDocParam(opts: Record<D | C, string>) {
    return {
      ...this.calcCollectionParam(opts),
      id: opts[this.scheme.documentKey]
    };
  }

  protected parseCollectionSnapshot(
    docs: DocumentSnapshotMock<T>[]
  ): TypedCollectionList<T> {
    return compact(
      docs.map(d => {
        const dd = d.data();
        return dd
          ? {
              id: d.id,
              data: dd
            }
          : null;
      })
    );
  }

  protected parseCollectionGroupSnapshot(
    docs: DocumentSnapshotMock<T>[]
  ): TypedCollectionGroupList<T> {
    return compact(
      docs.map(d => {
        const dd = d.data();
        return dd
          ? {
              fullPath: d.ref.path,
              ids: d.ref.path
                .split(/\//g)
                .reduce<
                  string[]
                >((prev, curr, i) => (i % 2 === 0 ? prev : [...prev, curr]), []),
              data: dd
            }
          : null;
      })
    );
  }

  protected abstract collectionReference(args: { collectionPath: string }): Cr;

  protected abstract collectionGroupReference(): Cr;

  protected abstract documentReference(args: {
    collectionPath: string;
    id?: string;
  }): Dr;

  protected newDocId({ collectionPath }: { collectionPath: string }) {
    const documentRef = this.documentReference({ collectionPath });
    return documentRef.id;
  }

  protected abstract setDoc(args: {
    ref: Dr;
    data: Object;
    merge?: boolean;
  }): Promise<void>;

  protected abstract getDoc(r: Dr): Promise<DocumentSnapshotMock<T>>;

  protected abstract deleteDoc(r: Dr): Promise<void>;

  protected abstract getQueryDocs(r: Cr): Promise<QuerySnapshotMock<T>>;

  protected abstract getQueryCount(r: Cr): Promise<number>;

  protected abstract subscribeDoc(args: {
    ref: Dr;
    handler: (d: DocumentSnapshotMock<T>) => void;
    onError: (e: unknown) => void;
  }): () => void;

  protected abstract subscribeQueryDocs(args: {
    ref: Cr;
    handler: (l: DocumentSnapshotMock<T>[]) => void;
    onError: (e: unknown) => void;
  }): () => void;

  protected abstract applyQueryFormula(ref: Cr, query?: QueryFormula<T>[]): Cr;

  public newItemId(opts: Record<C, string>) {
    return this.newDocId({
      collectionPath: calcCollectionPath(this.scheme, opts)
    });
  }

  public singleItemReference(opts: Record<D | C, string>): Dr {
    return this.documentReference(this.calcDocParam(opts));
  }

  private singleNewItemReference(opts: Record<C, string>): Dr {
    return this.documentReference(this.calcCollectionParam(opts));
  }

  private listQueryReference(
    opts: Record<C, string>,
    query?: QueryFormula<T>[]
  ): Cr {
    return this.applyQueryFormula(
      this.collectionReference(this.calcCollectionParam(opts)),
      query
    );
  }

  private groupQueryReference(query?: QueryFormula<T>[]) {
    return this.applyQueryFormula(this.collectionGroupReference(), query);
  }

  public async fetchItem(opts: Record<D | C, string>): Promise<T | undefined> {
    return this.getDoc(this.singleItemReference(opts)).then(s => s.data());
  }

  public setItem(
    opts: Record<D | C, string> & {
      data: T;
      merge?: boolean;
    }
  ) {
    const { data, merge } = opts;
    const ref = this.singleItemReference(opts);
    return this.setDoc({
      ref,
      data,
      merge
    }).then(() => ref.id);
  }

  public addItem(opts: Record<C, string> & { data: T }) {
    const { data } = opts;
    const ref = this.singleNewItemReference(opts);
    return this.setDoc({
      ref,
      data
    }).then(() => ref.id);
  }

  public mergeItem(opts: Record<D | C, string> & { data: Partial<T> }) {
    const { data } = opts;
    const ref = this.singleItemReference(opts);
    return this.setDoc({
      ref,
      data: data as Object,
      merge: true
    }).then(() => ref.id);
  }

  public deleteItem(opts: Record<D | C, string>) {
    return this.deleteDoc(this.singleItemReference(opts));
  }

  public subscribeItem(
    opts: Record<D | C, string> & {
      handler: (d: T | undefined) => void;
      onError: (e: unknown) => void;
    }
  ) {
    const { handler, onError } = opts;
    return this.subscribeDoc({
      ref: this.singleItemReference(opts),
      handler: snapshot => handler(snapshot.data()),
      onError
    });
  }

  public async fetchList(
    opts: Record<C, string> & { query?: QueryFormula<T>[] }
  ) {
    const { query } = opts;
    const ref = this.listQueryReference(opts, query);
    const snapshot = await this.getQueryDocs(ref);
    return this.parseCollectionSnapshot(snapshot.docs);
  }

  public async fetchListCount(
    opts: Record<C, string> & { query?: QueryFormula<T>[] }
  ) {
    const { query } = opts;
    const ref = this.listQueryReference(opts, query);
    const count = await this.getQueryCount(ref);
    return count;
  }

  public async fetchGroupList(query?: QueryFormula<T>[]) {
    const ref = this.groupQueryReference(query);
    const snapshot = await this.getQueryDocs(ref);
    return this.parseCollectionGroupSnapshot(snapshot.docs);
  }

  public fetchGroupListCount(query?: QueryFormula<T>[]) {
    const ref = this.groupQueryReference(query);
    return this.getQueryCount(ref);
  }

  public subscribeList(
    opts: Record<C, string> & {
      query?: QueryFormula<T>[];
      handler: (l: TypedCollectionList<T>) => void;
      onError: (e: unknown) => void;
    }
  ) {
    const { query, handler, onError } = opts;
    return this.subscribeQueryDocs({
      ref: this.listQueryReference(opts, query),
      handler: docs => handler(this.parseCollectionSnapshot(docs)),
      onError
    });
  }

  public subscribeGroupList({
    query,
    handler,
    onError
  }: {
    query?: QueryFormula<T>[];
    handler: (l: { fullPath: string; ids: string[]; data: T }[]) => void;
    onError: (e: unknown) => void;
  }) {
    return this.subscribeQueryDocs({
      ref: this.groupQueryReference(query),
      handler: docs => handler(this.parseCollectionGroupSnapshot(docs)),
      onError
    });
  }
}

export interface TransactionGetStepParams<
  Dr extends DocumentReferenceMock,
  Cr
> {
  get: <T extends {}, D extends string, C extends string>(
    s: DataStoreAgent<T, D, C, Dr, Cr>,
    o: Record<D | C, string>
  ) => Promise<T | undefined>;
}

export interface TransactionSetStepParams<
  Dr extends DocumentReferenceMock,
  Cr
> {
  set: <T extends {}, D extends string, C extends string>(
    s: DataStoreAgent<T, D, C, Dr, Cr>,
    args: Parameters<DataStoreAgent<T, D, C, Dr, Cr>["setItem"]>[0]
  ) => void;
  delete: <T extends {}, D extends string, C extends string>(
    s: DataStoreAgent<T, D, C, Dr, Cr>,
    args: Parameters<DataStoreAgent<T, D, C, Dr, Cr>["deleteItem"]>[0]
  ) => void;
}
