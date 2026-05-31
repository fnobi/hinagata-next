import { type CallableRequest } from "firebase-functions/v2/https";
import { functionRangeLogger } from "~/feature/logger";
import type AppCallableScheme from "@hinagata-next/core/feature/AppCallableScheme";
import { type CommonNGResponse } from "@hinagata-next/core/feature/AppCallableScheme";
import { parseString } from "@hinagata-next/core/common/parser-helper";

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
