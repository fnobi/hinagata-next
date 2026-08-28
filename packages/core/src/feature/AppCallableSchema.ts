import { type AppErrorMessageParameter } from "@hinagata-next/core/feature/AppError";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import type ProfilePost from "@hinagata-next/core/feature/ProfilePost";

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
  createProfile: AppCallableFunctionSchema<
    { profile: DummyProfile },
    | OKResponse<{
        charaId: string;
        profile: ProfilePost;
      }>
    | CommonNGResponse
  >;
};

export default AppCallableSchema;
