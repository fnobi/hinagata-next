import { type CallableRequest } from "firebase-functions/v2/https";
import { extractAppError } from "@hinagata-next/core/scheme/AppError";
import type AppCallableScheme from "@hinagata-next/core/scheme/AppCallableScheme";
import { type CommonNGResponse } from "@hinagata-next/core/scheme/AppCallableScheme";
import { functionRangeLogger } from "~/lib/logger-helper";

const responseAppCallable = async <T extends keyof AppCallableScheme>(
  req: CallableRequest<AppCallableScheme[T]["Request"]>,
  handler: (
    r: CallableRequest<AppCallableScheme[T]["Request"]>
  ) => Promise<AppCallableScheme[T]["Response"]>
): Promise<AppCallableScheme[T]["Response"] | CommonNGResponse> => {
  functionRangeLogger("callable", "begin");
  const res = await handler(req).catch((e): CommonNGResponse => {
    const error = extractAppError(e);
    // eslint-disable-next-line no-console
    console.log("[app error]", JSON.stringify(error));
    // eslint-disable-next-line no-console
    console.error(e);
    return { case: "ng", error };
  });
  functionRangeLogger("callable", "end");
  return res;
};

export default responseAppCallable;
