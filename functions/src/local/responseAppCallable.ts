import { type CallableRequest } from "firebase-functions/v2/https";
import { functionRangeLogger } from "@/local/logger";
import type AppCallableScheme from "~/features/schema/AppCallableScheme";
import { type CommonNGResponse } from "~/features/schema/AppCallableScheme";
import { parseString } from "~/common/lib/parser-helper";

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
