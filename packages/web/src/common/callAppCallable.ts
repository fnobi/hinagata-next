import { httpsCallable } from "firebase/functions";
import AppError from "@com-snickers/core/scheme/AppError";
import type AppCallableScheme from "@com-snickers/core/scheme/AppCallableScheme";
import { COMMON_CALLABLE_REGION } from "@com-snickers/core/scheme/AppCallableScheme";
import { firebaseFunctions } from "~/common/firebase-app";

type OkDataOf<Res> = Res extends { case: "ok"; data: infer T } ? T : never;

const callAppCallable = async <K extends keyof AppCallableScheme>(
  name: K,
  data: AppCallableScheme[K]["Request"]
): Promise<OkDataOf<AppCallableScheme[K]["Response"]>> => {
  const callable = httpsCallable(firebaseFunctions(COMMON_CALLABLE_REGION), name);
  const res = await callable(data);
  const body = res.data as AppCallableScheme[K]["Response"];
  if (body.case === "ng") {
    throw new AppError(body.error);
  }
  return body.data as OkDataOf<AppCallableScheme[K]["Response"]>;
};

export default callAppCallable;
