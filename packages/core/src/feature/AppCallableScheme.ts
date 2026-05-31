export const COMMON_CALLABLE_REGION = "asia-northeast1";

export type CommonNGResponse = {
  case: "ng";
  error: string;
};

export type OKResponse<T> = {
  case: "ok";
  data: T;
};

type AppCallableFunctionScheme<Req, Res> = {
  Request: Req;
  Response: Res;
};

type AppCallableScheme = {
  translateWithApi: AppCallableFunctionScheme<
    { jaWord: string },
    OKResponse<{ enWord: string }> | CommonNGResponse
  >;
};

export default AppCallableScheme;
