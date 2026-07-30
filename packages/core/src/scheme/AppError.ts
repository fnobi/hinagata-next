import { type AppErrorParameter } from "@hinagata-next/core/scheme/AppErrorParameter";

class AppError extends Error {
  public readonly parameter: AppErrorParameter;

  public constructor(param: AppErrorParameter) {
    super();
    this.parameter = param;
  }
}

export type AppErrorMessageParameter = AppErrorParameter & { message: string };

const COMMON_ERROR_MESSAGE = "エラーが発生しました。";
const ERROR_MESSAGE: Partial<Record<AppErrorParameter["type"], string>> = {
  unauthorized: "認証に失敗しています",
  "bad-parameter": "必要なパラメーターが不足しています"
};

export const extractAppError = (err: unknown): AppErrorMessageParameter => {
  const error: AppErrorParameter =
    err instanceof AppError ? err.parameter : { type: "unknown" };
  return {
    ...error,
    message: ERROR_MESSAGE[error.type] || COMMON_ERROR_MESSAGE
  };
};

export default AppError;
