import {
  type DocumentData,
  type DocumentReference,
  type Query,
  type Firestore
} from "firebase-admin/firestore";
import {
  DataStoreAgent,
  type DocumentSnapshotMock,
  type TransactionGetStepParams,
  type TransactionSetStepParams,
  type DataStoreScheme,
  type QueryFormula
} from "~/common/lib/DataStoreAgent";
import { parseString } from "~/common/lib/parser-helper";

export class ServerDataStoreAgent<
  T extends {},
  D extends string,
  C extends string
> extends DataStoreAgent<
  T,
  D,
  C,
  DocumentReference<T, DocumentData>,
  Query<T, DocumentData>
> {
  private adapter: () => Firestore;

  public constructor(
    adapter: () => Firestore,
    scheme: DataStoreScheme<T, D, C>
  ) {
    super(scheme);
    this.adapter = adapter;
  }

  protected collectionReference({
    collectionPath
  }: {
    collectionPath: string;
  }) {
    return this.adapter()
      .collection(collectionPath)
      .withConverter(this.converter);
  }

  protected collectionGroupReference() {
    return this.adapter()
      .collectionGroup(this.scheme.name)
      .withConverter(this.converter);
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

  protected async setDoc({
    ref,
    data,
    merge
  }: {
    ref: DocumentReference;
    data: Object;
    merge?: boolean;
  }) {
    await ref.set(data, { merge });
  }

  protected getDoc(r: DocumentReference<T, DocumentData>) {
    return r.get();
  }

  protected async deleteDoc(r: DocumentReference) {
    await r.delete();
  }

  protected getQueryDocs(r: Query<T, DocumentData>) {
    return r.get();
  }

  protected async getQueryCount(r: Query) {
    const snapshot = await r.count().get();
    return snapshot.data().count;
  }

  protected subscribeDoc({
    ref,
    handler,
    onError
  }: {
    ref: DocumentReference<T, DocumentData>;
    handler: (d: Object | undefined) => void;
    onError: (e: unknown) => void;
  }) {
    return ref.onSnapshot(handler, onError);
  }

  protected subscribeQueryDocs({
    ref,
    handler,
    onError
  }: {
    ref: Query<T, DocumentData>;
    handler: (l: DocumentSnapshotMock<T>[]) => void;
    onError: (e: unknown) => void;
  }) {
    return ref.onSnapshot(snapshot => handler(snapshot.docs), onError);
  }

  protected applyQueryFormula(
    ref: Query<T, DocumentData>,
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

  public static runTransaction<T extends {}, M, R>(
    adapter: () => Firestore,
    getStep: (
      o: TransactionGetStepParams<
        T,
        DocumentReference<T, DocumentData>,
        Query<T, DocumentData>
      >
    ) => Promise<M>,
    setStep: (
      p: M,
      m: TransactionSetStepParams<
        T,
        DocumentReference<T, DocumentData>,
        Query<T, DocumentData>
      >
    ) => R
  ) {
    return adapter().runTransaction(async t => {
      const r = await getStep({
        get: (a, o) => t.get(a.singleItemReference(o)).then(s => s.data())
      });
      return setStep(r, {
        set: (s, args) =>
          t.set(s.singleItemReference(args), args.data, { merge: args.merge }),
        delete: (s, args) => t.delete(s.singleItemReference(args))
      });
    });
  }
}
