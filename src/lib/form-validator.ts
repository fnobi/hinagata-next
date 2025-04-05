import { compact } from "~/lib/array-util";
import { type FormNestValidator } from "~/lib/react/form-nest";

const EMAIL_REGEXP =
  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

const URL_REGEXP = /^https?:\/\//;

export type AppValidationErrorType =
  | { type: "required" }
  | { type: "too-long-string"; maxLength: number }
  | { type: "invalid-email" }
  | { type: "invalid-url" }
  | { type: "invalid-array-length"; minLength: number; maxLength: number };

export const maxLengthValidator = (
  maxLength: number
): FormNestValidator<string, AppValidationErrorType> => ({
  param: { type: "too-long-string", maxLength },
  validate: v =>
    !!v && v.length > maxLength ? `${maxLength}字以内で入力してください` : null
});

export const emailValidator = (): FormNestValidator<
  string,
  AppValidationErrorType
> => ({
  param: { type: "invalid-email" },
  validate: v =>
    !!v && !EMAIL_REGEXP.test(v) ? "メールアドレスの形式が不正です" : null
});

export const urlValidator = (): FormNestValidator<
  string,
  AppValidationErrorType
> => ({
  param: { type: "invalid-url" },
  validate: v => (!!v && !URL_REGEXP.test(v) ? "URLの形式が不正です" : null)
});

export const requiredValidator = (): FormNestValidator<
  string,
  AppValidationErrorType
> => ({
  param: { type: "required" },
  validate: v => (!v ? "入力必須です" : null)
});

export const arrayLengthValidator = ({
  minLength = 0,
  maxLength = -1
}: {
  minLength?: number;
  maxLength?: number;
}): FormNestValidator<unknown[], AppValidationErrorType> => ({
  param: {
    type: "invalid-array-length",
    minLength,
    maxLength
  },
  validate: values => {
    if (
      values.length >= minLength &&
      (maxLength < 0 || values.length <= maxLength)
    ) {
      return null;
    }
    const l =
      minLength === maxLength
        ? `${maxLength}個`
        : compact([
            minLength >= 0 ? `${minLength}個以上` : null,
            maxLength >= 0 ? `${maxLength}個以下` : null
          ]).join("");
    return `要素数が不正です。${l}で設定してください。`;
  }
});
