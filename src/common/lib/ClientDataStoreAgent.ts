import {
  collection,
  doc,
  limit,
  onSnapshot,
  getDocs,
  orderBy,
  query,
  where,
  setDoc,
  getDoc,
  deleteDoc,
  collectionGroup,
  type DocumentData,
  type Query,
  type DocumentReference,
  runTransaction,
  getCountFromServer
} from "firebase/firestore";
import { parseString } from "~/common/lib/parser-helper";
import {
  DataStoreAgent,
  type QueryFormula,
  type DocumentSnapshotMock,
  type TransactionGetStepParams,
  type TransactionSetStepParams
} from "~/common/lib/DataStoreAgent";
import { firebaseFirestore } from "~/common/lib/firebase-app";

type Dr<T> = DocumentReference<T, DocumentData>;
type Cr<T> = Query<T, DocumentData>;

// eslint-disable-next-line import/prefer-default-export
export class ClientDataStoreAgent<
  T extends {},
  D extends string,
  C extends string
> extends DataStoreAgent<T, D, C, Dr<T>, Cr<T>> {
  protected collectionReference({
    collectionPath
  }: {
    collectionPath: string;
  }) {
    return collection(firebaseFirestore(), collectionPath).withConverter(
      this.converter
    );
  }

  protected collectionGroupReference() {
    return collectionGroup(firebaseFirestore(), this.scheme.name).withConverter(
      this.converter
    );
  }

  protected documentReference({
    collectionPath,
    id
  }: {
    collectionPath: string;
    id?: string;
  }) {
    const collectionRef = this.collectionReference({ collectionPath });
    return id ? doc(collectionRef, id) : doc(collectionRef);
  }

  protected override setDoc({
    ref,
    data,
    merge
  }: {
    ref: Dr<T>;
    data: Object;
    merge?: boolean;
  }) {
    return setDoc(ref, data, { merge });
  }

  protected getDoc(r: Dr<T>) {
    return getDoc(r);
  }

  protected async deleteDoc(r: Dr<T>) {
    await deleteDoc(r);
  }

  protected getQueryDocs(r: Cr<T>) {
    return getDocs(r);
  }

  protected async getQueryCount(r: Cr<T>) {
    const snapshot = await getCountFromServer(r);
    return snapshot.data().count;
  }

  protected subscribeDoc({
    ref,
    handler,
    onError
  }: {
    ref: Dr<T>;
    handler: (d: Object | undefined) => void;
    onError: (e: unknown) => void;
  }) {
    return onSnapshot(ref, handler, onError);
  }

  protected subscribeQueryDocs({
    ref,
    handler,
    onError
  }: {
    ref: Cr<T>;
    handler: (l: DocumentSnapshotMock<T>[]) => void;
    onError: (e: unknown) => void;
  }) {
    return onSnapshot(ref, snapshot => handler(snapshot.docs), onError);
  }

  protected applyQueryFormula(ref: Cr<T>, q: QueryFormula<T>[] = []): Cr<T> {
    return q.length
      ? query(
          ref,
          ...q.map(l => {
            switch (l[0]) {
              case "limit":
                return limit(l[1]);
              case "orderBy":
                return orderBy(parseString(l[1]), l[2]);
              case "equal":
                return where(parseString(l[1]), "==", l[2]);
              default:
                return where(parseString(l[1]), l[2], l[3]);
            }
          })
        )
      : ref;
  }

  public static runTransaction<M, R>(
    getStep: (o: TransactionGetStepParams) => Promise<M>,
    setStep: (p: M, m: TransactionSetStepParams) => R
  ) {
    return runTransaction(firebaseFirestore(), async t => {
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
