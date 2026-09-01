import {
  type Transaction,
  type DocumentData,
  type DocumentReference,
  type Query,
  type DocumentSnapshot
} from "firebase-admin/firestore";
import { AdminDataStoreAgent } from "@hinagata-next/core/common/AdminDataStoreAgent";

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
  Query<DocumentData, DocumentData>,
  Transaction
> {}
