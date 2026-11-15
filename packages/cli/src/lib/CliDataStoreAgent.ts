import {
  type Firestore,
  type DocumentData,
  type DocumentReference,
  type Query,
  type DocumentSnapshot
} from "firebase-admin/firestore";
import { AdminDataStoreAgent } from "@hinagata-next/core/common/AdminDataStoreAgent";
import {
  type TransactionGetStepParams,
  type TransactionSetStepParams
} from "@hinagata-next/core/common/DataStoreAgent";

export class CliDataStoreAgent<
  T extends object,
  D extends string,
  C extends string
> extends AdminDataStoreAgent<
  T,
  D,
  C,
  DocumentSnapshot,
  DocumentReference<DocumentData, DocumentData>,
  Query<DocumentData, DocumentData>
> {
  public static runTransaction<M, R>(
    adapter: () => Firestore,
    getStep: (
      o: TransactionGetStepParams<DocumentReference, Query>
    ) => Promise<M>,
    setStep: (p: M, m: TransactionSetStepParams<DocumentReference, Query>) => R
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
