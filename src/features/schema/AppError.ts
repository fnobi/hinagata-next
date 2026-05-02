import { type AppErrorParameter } from "~/features/schema/AppErrorParameter";

class AppError extends Error {
  public readonly parameter: AppErrorParameter;

  public constructor(param: AppErrorParameter) {
    super();
    this.parameter = param;
  }
}

export const extractAppError = (err: unknown): AppErrorParameter =>
  err instanceof AppError ? err.parameter : { type: "unknown" };

export default AppError;
