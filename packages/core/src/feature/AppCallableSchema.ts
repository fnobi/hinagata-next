import { type AppErrorMessageParameter } from "@hinagata-next/core/feature/AppError";
import { type UserRecord } from "@hinagata-next/core/feature/UserRecord";

export const COMMON_CALLABLE_REGION = "asia-northeast1";

export type CommonNGResponse = {
  case: "ng";
  error: AppErrorMessageParameter;
};

export type OKResponse<T> = {
  case: "ok";
  data: T;
};

type AppCallableFunctionSchema<Req, Res> = {
  Request: Req;
  Response: Res;
};

type AppCallableSchema = {
  createUser: AppCallableFunctionSchema<
    { nickname: string },
    | OKResponse<{
        userId: string;
        data: UserRecord;
      }>
    | CommonNGResponse
  >;
};

export default AppCallableSchema;
