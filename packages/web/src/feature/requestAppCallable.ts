import requestCallable from "~/common/requestCallable";
import type AppCallableScheme from "~/feature/AppCallableScheme";
import {
  COMMON_CALLABLE_REGION,
  type CommonNGResponse
} from "~/feature/AppCallableScheme";

const requestAppCallable = <T extends keyof AppCallableScheme>(
  path: T,
  req: AppCallableScheme[T]["Request"]
) =>
  requestCallable<
    AppCallableScheme[T]["Request"],
    AppCallableScheme[T]["Response"] | CommonNGResponse
  >(COMMON_CALLABLE_REGION, path, req);

export default requestAppCallable;
