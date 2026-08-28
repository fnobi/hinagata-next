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
import { parseString } from "@hinagata-next/core/common/parser-helper";
import {
  DataStoreAgent,
  type QueryFormula,
  type DocumentSnapshotMock,
  type TransactionGetStepParams,
  type TransactionSetStepParams
} from "@hinagata-next/core/common/DataStoreAgent";
import { firebaseFirestore } from "~/common/firebase-app";

// eslint-disable-next-line import/prefer-default-export
export class ClientDataStoreAgent<
  T extends object,
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
    return collectionGroup(firebaseFirestore(), this.schema.name);
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

  protected override newDocId(opts: { collectionPath: string }) {
    const documentRef = this.documentReference(opts);
    return documentRef.id;
  }

  protected override async setDoc({
    ref,
    data,
    merge
  }: {
    ref: DocumentReference;
    data: Object;
    merge?: boolean;
  }) {
    await setDoc(ref, data, { merge });
    return ref.id;
  }

  protected getDoc(r: DocumentReference) {
    return getDoc(r);
  }

  protected async deleteDoc(r: DocumentReference) {
    await deleteDoc(r);
  }

  protected getQueryDocs(r: Query) {
    return getDocs(r).then(snapshot => snapshot.docs);
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
    handler: (d: Object | null) => void;
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
    handler: (l: DocumentSnapshotMock[]) => void;
    onError: (e: unknown) => void;
  }) {
    return onSnapshot(ref, snapshot => handler(snapshot.docs), onError);
  }

  protected applyQueryFormula(
    ref: Query<DocumentData, DocumentData>,
    q: QueryFormula<T>[] = []
  ): Query<DocumentData, DocumentData> {
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

  public static runTransaction<M>(
    getStep: (
      o: TransactionGetStepParams<DocumentReference, Query>
    ) => Promise<M>,
    setStep: (
      p: M,
      m: TransactionSetStepParams<DocumentReference, Query>
    ) => void
  ) {
    return runTransaction(firebaseFirestore(), async t => {
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
