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

export const infoLogger = (message: string, data: Object = {}) =>
  logWrapper({ severity: "INFO", message, ...data });

export const warnLogger = (message: string, data: Object = {}) =>
  logWrapper({ severity: "WARNING", message, ...data });

export const errorLogger = (message: string, err: Error, data: Object) =>
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
  data?: Object
) => infoLogger(`[${label}:${step}]`, data);
