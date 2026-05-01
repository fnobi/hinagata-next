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

// eslint-disable-next-line import/prefer-default-export
export class ClientDataStoreAgent<
  T extends {},
  D extends string,
  C extends string
> extends DataStoreAgent<T, D, C, DocumentReference, Query> {
  protected collectionReference({
    collectionPath
  }: {
    collectionPath: string;
  }) {
    return collection(firebaseFirestore(), collectionPath);
  }

  protected collectionGroupReference() {
    return collectionGroup(firebaseFirestore(), this.scheme.name);
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
    ref: DocumentReference;
    data: Object;
    merge?: boolean;
  }) {
    return setDoc(ref, data, { merge });
  }

  protected getDoc(r: DocumentReference) {
    return getDoc(r.withConverter(this.converter));
  }

  protected async deleteDoc(r: DocumentReference) {
    await deleteDoc(r);
  }

  protected getQueryDocs(r: Query) {
    return getDocs(r.withConverter(this.converter));
  }

  protected async getQueryCount(r: Query) {
    const snapshot = await getCountFromServer(r);
    return snapshot.data().count;
  }

  protected subscribeDoc({
    ref,
    handler,
    onError
  }: {
    ref: DocumentReference;
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
    ref: Query;
    handler: (l: DocumentSnapshotMock<T>[]) => void;
    onError: (e: unknown) => void;
  }) {
    return onSnapshot(
      ref.withConverter(this.converter),
      snapshot => handler(snapshot.docs),
      onError
    );
  }

  protected applyQueryFormula(ref: Query, q: QueryFormula<T>[] = []): Query {
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
    getStep: (
      o: TransactionGetStepParams<DocumentReference, Query>
    ) => Promise<M>,
    setStep: (p: M, m: TransactionSetStepParams<DocumentReference, Query>) => R
  ) {
    return runTransaction(firebaseFirestore(), async t => {
      const r = await getStep({
        get: (a, o) =>
          t
            .get(a.singleItemReference(o).withConverter(a.converter))
            .then(s => s.data())
      });
      return setStep(r, {
        set: (s, args) =>
          t.set(s.singleItemReference(args), args.data, { merge: args.merge }),
        delete: (s, args) => t.delete(s.singleItemReference(args))
      });
    });
  }
}
