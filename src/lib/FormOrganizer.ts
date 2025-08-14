import FormOrganizerBase from "~/lib/FormOrganizerBase";

const EMAIL_REGEXP =
  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

const URL_REGEXP = /^https?:\/\//;

export type ValidationErrorType =
  | { type: "required" }
  | { type: "string-max-length"; maxLength: number }
  | { type: "string-min-length"; minLength: number }
  | { type: "email-format" }
  | { type: "url-format" }
  | { type: "array-length"; minLength: number; maxLength: number }
  | { type: "password-confirmation" };

class FormOrganizer<T> extends FormOrganizerBase<T, ValidationErrorType> {
  // eslint-disable-next-line class-methods-use-this
  protected testFunctions(v: unknown, param: ValidationErrorType) {
    switch (param.type) {
      case "string-max-length":
        return typeof v === "string" && v.length <= param.maxLength;
      case "string-min-length":
        return typeof v === "string" && v.length >= param.minLength;
      case "email-format":
        return typeof v === "string" && EMAIL_REGEXP.test(v);
      case "url-format":
        return typeof v === "string" && URL_REGEXP.test(v);
      case "array-length":
        return (
          Array.isArray(v) &&
          v.length >= param.minLength &&
          (param.maxLength < 0 || v.length <= param.maxLength)
        );
      case "password-confirmation": // NOTE: 少々特殊なので具体処理はcustomValidatorで書く
      case "required":
      default:
        return !!v;
    }
  }

  public get maxLengthes() {
    return this.validators.reduce(
      (prev, { key, param }) =>
        param.type === "string-max-length"
          ? {
              ...prev,
              [key]: prev[key] || param.maxLength
            }
          : prev,
      {} as Record<keyof T, number | undefined>
    );
  }

  public get arrayRanges() {
    return this.validators.reduce(
      (prev, { key, param }) =>
        param.type === "array-length"
          ? {
              ...prev,
              [key]: prev[key] || param
            }
          : prev,
      {} as Record<
        keyof T,
        { maxLength: number; minLength: number } | undefined
      >
    );
  }
}

export default FormOrganizer;
