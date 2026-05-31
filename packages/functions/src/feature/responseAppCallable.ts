import { type CallableRequest } from "firebase-functions/v2/https";
import { parseString } from "@hinagata-next/core/common/parser-helper";
import type AppCallableScheme from "@hinagata-next/core/feature/AppCallableScheme";
import { type CommonNGResponse } from "@hinagata-next/core/feature/AppCallableScheme";
import { functionRangeLogger } from "~/feature/logger";

const responseAppCallable = async <T extends keyof AppCallableScheme>(
  req: CallableRequest<AppCallableScheme[T]["Request"]>,
  handler: (
    r: CallableRequest<AppCallableScheme[T]["Request"]>
  ) => Promise<AppCallableScheme[T]["Response"]>
): Promise<AppCallableScheme[T]["Response"] | CommonNGResponse> => {
  functionRangeLogger("callable", "begin");
  const res = await handler(req).catch((e): CommonNGResponse => {
    console.log("[app error]", JSON.stringify(e));
    console.error(e);
    return { case: "ng", error: parseString(e) };
  });
  functionRangeLogger("callable", "end");
  return res;
};

export default responseAppCallable;
