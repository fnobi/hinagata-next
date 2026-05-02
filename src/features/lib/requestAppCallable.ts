import requestCallable from "~/common/lib/requestCallable";
import type AppCallableScheme from "~/features/schema/AppCallableScheme";
import {
  COMMON_CALLABLE_REGION,
  type CommonNGResponse
} from "~/features/schema/AppCallableScheme";

const requestAppCallable = <T extends keyof AppCallableScheme>(
  path: T,
  req: AppCallableScheme[T]["Request"]
) =>
  requestCallable<
    AppCallableScheme[T]["Request"],
    AppCallableScheme[T]["Response"] | CommonNGResponse
  >(COMMON_CALLABLE_REGION, path, req);

export default requestAppCallable;
