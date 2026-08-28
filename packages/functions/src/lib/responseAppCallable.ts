import { type CallableRequest } from "firebase-functions/v2/https";
import { extractAppError } from "@hinagata-next/core/feature/AppError";
import type AppCallableSchema from "@hinagata-next/core/feature/AppCallableSchema";
import { type CommonNGResponse } from "@hinagata-next/core/feature/AppCallableSchema";
import { functionRangeLogger } from "~/lib/logger-helper";

const responseAppCallable = async <T extends keyof AppCallableSchema>(
  req: CallableRequest<AppCallableSchema[T]["Request"]>,
  handler: (
    r: CallableRequest<AppCallableSchema[T]["Request"]>
  ) => Promise<AppCallableSchema[T]["Response"]>
): Promise<AppCallableSchema[T]["Response"] | CommonNGResponse> => {
  functionRangeLogger("callable", "begin");
  const res = await handler(req).catch((e): CommonNGResponse => {
    const error = extractAppError(e);
    console.log("[app error]", JSON.stringify(error));
    console.error(e);
    return { case: "ng", error };
  });
  functionRangeLogger("callable", "end");
  return res;
};

export default responseAppCallable;
