import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "~/common/firebase-app";

const requestCallable = <Req, Res>(region: string, name: string, req: Req) =>
  httpsCallable<Req, Res>(
    firebaseFunctions(region),
    name
  )(req).then(r => r.data);

export default requestCallable;
