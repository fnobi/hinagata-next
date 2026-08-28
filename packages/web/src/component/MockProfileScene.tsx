import { FIREBASE_ENABLED } from "~/common/firebaseConfig";
import LocalProfileScene from "~/component/LocalProfileScene";
import RemoteProfileScene from "~/component/RemoteProfileScene";

const MockProfileScene = () =>
  FIREBASE_ENABLED ? <RemoteProfileScene /> : <LocalProfileScene />;

export default MockProfileScene;
