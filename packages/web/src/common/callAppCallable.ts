import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "~/common/firebase-app";
import AppError from "@hinagata-next/core/feature/AppError";
import type AppCallableSchema from "@hinagata-next/core/feature/AppCallableSchema";
import { COMMON_CALLABLE_REGION } from "@hinagata-next/core/feature/AppCallableSchema";

type OkDataOf<Res> = Res extends { case: "ok"; data: infer T } ? T : never;

const callAppCallable = async <K extends keyof AppCallableSchema>(
  name: K,
  data: AppCallableSchema[K]["Request"]
): Promise<OkDataOf<AppCallableSchema[K]["Response"]>> => {
  const callable = httpsCallable(
    firebaseFunctions(COMMON_CALLABLE_REGION),
    name as string
  );
  const res = await callable(data);
  const body = res.data as AppCallableSchema[K]["Response"];
  if (body.case === "ng") {
    throw new AppError(body.error);
  }
  return body.data as OkDataOf<AppCallableSchema[K]["Response"]>;
};

export default callAppCallable;
