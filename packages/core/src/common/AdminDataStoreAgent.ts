import {
  DataStoreAgent,
  type DocumentSnapshotMock,
  type TransactionGetStepParams,
  type TransactionSetStepParams,
  type DataStoreSchema,
  type QueryFormula,
  type CollectionReferenceMock,
  type DocumentReferenceMock,
  type QueryReferenceMock,
  type TransactionMock
} from "@hinagata-next/core/common/DataStoreAgent";
import { parseString } from "@hinagata-next/core/common/parser-helper";

type AbstructAdminFirestore<Dr, Cr, Tr> = {
  collection: (p: string) => CollectionReferenceMock<Cr, Dr>;
  collectionGroup: (p: string) => Cr;
  doc: (p: string) => Dr;
  runTransaction: (fn: (t: Tr) => Promise<unknown>) => void;
};

export class AdminDataStoreAgent<
  T extends object,
  D extends string,
  C extends string,
  Ds extends DocumentSnapshotMock,
  Dr extends DocumentReferenceMock<Ds>,
  Cr extends QueryReferenceMock<Ds, Dr>,
  Tr extends TransactionMock<Ds, Dr>
> extends DataStoreAgent<T, D, C, Dr, Cr> {
  private adapter: () => AbstructAdminFirestore<Dr, Cr, Tr>;

  public constructor(
    adapter: () => AbstructAdminFirestore<Dr, Cr, Tr>,
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

  protected applyQueryFormula<R extends QueryReferenceMock<Ds, Dr>>(
    ref: R,
    query: QueryFormula<T>[] = []
  ) {
    return query.reduce((prev, l) => {
      // TODO: できればasやめたい
      switch (l[0]) {
        case "limit":
          return prev.limit(l[1]) as R;
        case "orderBy":
          return prev.orderBy(parseString(l[1]), l[2]) as R;
        case "equal":
          return prev.where(parseString(l[1]), "==", l[2]) as R;
        default:
          return prev.where(parseString(l[1]), l[2], l[3]) as R;
      }
    }, ref);
  }

  public static runTransaction<
    M,
    R,
    Ds extends DocumentSnapshotMock,
    Dr extends DocumentReferenceMock<Ds>,
    Cr extends QueryReferenceMock<Ds, Dr>,
    Tr extends TransactionMock<Ds, Dr>
  >(
    adapter: () => AbstructAdminFirestore<Dr, Cr, Tr>,
    getStep: (o: TransactionGetStepParams<Dr, Cr>) => Promise<M>,
    setStep: (p: M, m: TransactionSetStepParams<Dr, Cr>) => R
  ) {
    return adapter().runTransaction(async t => {
      const r = await getStep({
        get: async (s, o) =>
          s.parseDocumentSnapshot(await t.get(s.singleItemReference(o)))
      });
      return setStep(r, {
        set: (s, args) =>
          t.set(s.singleItemReference(args), args.data, { merge: args.merge }),
        delete: (s, args) => t.delete(s.singleItemReference(args))
      });
    });
  }
}
