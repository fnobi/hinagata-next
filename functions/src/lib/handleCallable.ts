import { https } from "firebase-functions";
import { type CallableContext } from "firebase-functions/v1/https";

const handleCallable = <Req, Res>(
  fn: (data: Req, context: CallableContext) => Promise<Res>
) => https.onCall(fn);

export default handleCallable;
