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
  getCountFromServer,
  type FirestoreDataConverter
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
> extends DataStoreAgent<
  T,
  D,
  C,
  DocumentReference<T, DocumentData>,
  Query<T, DocumentData>
> {
  private get converter(): FirestoreDataConverter<T> {
    return {
      toFirestore: (d: T) => d,
      fromFirestore: (s, o) => this.scheme.parse(s.data(o))
    };
  }

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

  protected getDoc(r: DocumentReference<T, DocumentData>) {
    return getDoc(r);
  }

  protected async deleteDoc(r: DocumentReference<T, DocumentData>) {
    await deleteDoc(r);
  }

  protected getQueryDocs(r: Query<T, DocumentData>) {
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
    ref: DocumentReference<T, DocumentData>;
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
    ref: Query<T, DocumentData>;
    handler: (l: DocumentSnapshotMock<T>[]) => void;
    onError: (e: unknown) => void;
  }) {
    return onSnapshot(ref, snapshot => handler(snapshot.docs), onError);
  }

  protected applyQueryFormula(
    ref: Query<T, DocumentData>,
    q: QueryFormula<T>[] = []
  ): Query<T, DocumentData> {
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

  public static runTransaction<T extends {}, M>(
    getStep: (
      o: TransactionGetStepParams<T, DocumentReference<T, DocumentData>, Query>
    ) => Promise<M>,
    setStep: (
      p: M,
      m: TransactionSetStepParams<T, DocumentReference<T, DocumentData>, Query>
    ) => void
  ) {
    return runTransaction(firebaseFirestore(), async t => {
      const r = await getStep({
        get: async (s, o) => {
          const dd = await t.get(s.singleItemReference(o));
          return s.parseDocumentSnapshot(dd);
        }
      });
      return setStep(r, {
        set: (s, args) =>
          t.set(s.singleItemReference(args), args.data, { merge: args.merge }),
        delete: (s, args) => t.delete(s.singleItemReference(args))
      });
    });
  }
}
