import type FormOrganizer from "~/lib/FormOrganizer";

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
  | { type: "sub-array-field" }
  | { type: "password-confirmation" };

export type FormOrganizerValidator<T> = {
  param: ValidationErrorType;
  test: (v: T) => boolean;
};

export const requiredValidator = (): FormOrganizerValidator<
  string | number | boolean | null
> => ({
  param: { type: "required" },
  test: v => !!v
});

export const stringMaxLengthValidator = (
  maxLength: number
): FormOrganizerValidator<string | unknown[]> => ({
  param: { type: "string-max-length", maxLength },
  test: v => v.length <= maxLength
});

export const stringMinLengthValidator = (
  minLength: number
): FormOrganizerValidator<string | unknown[]> => ({
  param: { type: "string-min-length", minLength },
  test: v => v.length >= minLength
});

export const emailFormatValidator = (): FormOrganizerValidator<string> => ({
  param: { type: "email-format" },
  test: v => EMAIL_REGEXP.test(v)
});

export const urlFormatValidator = (): FormOrganizerValidator<string> => ({
  param: { type: "url-format" },
  test: v => URL_REGEXP.test(v)
});

export const arrayLengthValidator = (
  minLength: number,
  maxLength: number
): FormOrganizerValidator<unknown[]> => ({
  param: { type: "array-length", minLength, maxLength },
  test: v => v.length >= minLength && (maxLength < 0 || v.length <= maxLength)
});

export const subArrayFieldValidator = <T>(
  sub: FormOrganizer<T>
): FormOrganizerValidator<T[]> => ({
  param: { type: "sub-array-field" },
  test: v => v.every(vv => sub.getValidValue(vv).validValue)
});
