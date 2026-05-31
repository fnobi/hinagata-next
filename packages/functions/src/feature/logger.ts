const logWrapper = (
  opts:
    | {
        severity: "INFO" | "WARNING";
        message: string;
      }
    | {
        severity: "ERROR";
        message: string;
        name: string;
        stack_trace?: string;
      }
) => console.log(JSON.stringify(opts));

export const infoLogger = (message: string, data: object = {}) =>
  logWrapper({ severity: "INFO", message, ...data });

export const warnLogger = (message: string, data: object = {}) =>
  logWrapper({ severity: "WARNING", message, ...data });

export const errorLogger = (message: string, err: Error, data: object) =>
  logWrapper({
    severity: "ERROR",
    message,
    name: err.name,
    stack_trace: err.stack,
    ...data
  });

export const functionRangeLogger = (
  label: "callable",
  step: "begin" | "end",
  data?: object
) => infoLogger(`[${label}:${step}]`, data);
