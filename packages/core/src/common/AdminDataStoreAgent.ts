import {
  DataStoreAgent,
  type DocumentSnapshotMock,
  type DataStoreSchema,
  type QueryFormula,
  type CollectionReferenceMock,
  type DocumentReferenceMock,
  type QueryReferenceMock
} from "@hinagata-next/core/common/DataStoreAgent";
import { parseString } from "@hinagata-next/core/common/parser-helper";

type AbstructAdminFirestore<Dr, Cr> = {
  collection: (p: string) => CollectionReferenceMock<Cr, Dr>;
  collectionGroup: (p: string) => Cr;
  doc: (p: string) => Dr;
};

export class AdminDataStoreAgent<
  T extends object,
  D extends string,
  C extends string,
  Ds extends DocumentSnapshotMock,
  Dr extends DocumentReferenceMock<Ds>,
  Cr extends QueryReferenceMock<Ds>
> extends DataStoreAgent<T, D, C, Dr, Cr> {
  private adapter: () => AbstructAdminFirestore<Dr, Cr>;

  public constructor(
    adapter: () => AbstructAdminFirestore<Dr, Cr>,
    schema: DataStoreSchema<T, D, C>
  ) {
    super(schema);
    this.adapter = adapter;
  }

  protected collectionReference({
    collectionPath
  }: {
    collectionPath: string;
  }) {
    return this.adapter().collection(collectionPath);
  }

  protected collectionGroupReference() {
    return this.adapter().collectionGroup(this.schema.name);
  }

  protected documentReference({
    collectionPath,
    id
  }: {
    collectionPath: string;
    id?: string;
  }) {
    const collectionRef = this.collectionReference({ collectionPath });
    return id ? collectionRef.doc(id) : collectionRef.doc();
  }

  protected override newDocId(opts: { collectionPath: string }) {
    const documentRef = this.documentReference(opts);
    return documentRef.id;
  }

  protected async setDoc({
    ref,
    data,
    merge
  }: {
    ref: Dr;
    data: object;
    merge?: boolean;
  }) {
    await ref.set(data, { merge });
    return ref.id;
  }

  protected getDoc(r: Dr) {
    return r.get();
  }

  protected async deleteDoc(r: Dr) {
    await r.delete();
  }

  protected getQueryDocs(r: Cr) {
    return r.get().then(snapshot => snapshot.docs);
  }

  protected async getQueryCount(r: Cr) {
    const snapshot = await r.count().get();
    return snapshot.data().count;
  }

  protected subscribeDoc({
    ref,
    handler,
    onError
  }: {
    ref: Dr;
    handler: (d: object | null) => void;
    onError: (e: unknown) => void;
  }) {
    return ref.onSnapshot(handler, onError);
  }

  protected subscribeQueryDocs({
    ref,
    handler,
    onError
  }: {
    ref: Cr;
    handler: (l: Ds[]) => void;
    onError: (e: unknown) => void;
  }) {
    return ref.onSnapshot(snapshot => handler(snapshot.docs), onError);
  }

  protected applyQueryFormula<R extends QueryReferenceMock<Ds>>(
    ref: R,
    query: QueryFormula<T>[] = []
  ) {
    return query.reduce((prev, l) => {
      switch (l[0]) {
        case "limit":
          return prev.limit(l[1]);
        case "orderBy":
          return prev.orderBy(parseString(l[1]), l[2]);
        case "equal":
          return prev.where(parseString(l[1]), "==", l[2]);
        default:
          return prev.where(parseString(l[1]), l[2], l[3]);
      }
    }, ref);
  }
}
