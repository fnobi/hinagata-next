import { FormNestValidator } from "~/lib/react/form-nest";

export type ValidationErrorType =
  | "required"
  | "too-long-text"
  | "invalid-email"
  | "invalid-url"
  | "bad-array-length";

const EMAIL_REGEXP =
  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

const URL_REGEXP = /^https?:\/\//;

export class MaxLengthValidator
  implements FormNestValidator<string, ValidationErrorType>
{
  public readonly maxLength: number;

  public get type(): ValidationErrorType {
    return "too-long-text";
  }

  public constructor(l: number) {
    this.maxLength = l;
  }

  public validate(v: string) {
    return !!v && v.length > this.maxLength;
  }

  public getErrorMessage() {
    return `${this.maxLength}字以内で入力してください`;
  }
}

export class EmailValidator
  implements FormNestValidator<string, ValidationErrorType>
{
  public get type(): ValidationErrorType {
    return "invalid-email";
  }
  public validate(v: string) {
    return !!v && !EMAIL_REGEXP.test(v);
  }
  public getErrorMessage() {
    return "メールアドレスの形式が不正です";
  }
}

export class UrlValidator
  implements FormNestValidator<string, ValidationErrorType>
{
  public get type(): ValidationErrorType {
    return "invalid-url";
  }
  public validate(v: string) {
    return !!v && !URL_REGEXP.test(v);
  }
  public getErrorMessage() {
    return "URLの形式が不正です";
  }
}

export class RequiredValidator
  implements FormNestValidator<string, ValidationErrorType>
{
  public get type(): ValidationErrorType {
    return "required";
  }
  public validate(v: string) {
    return !v;
  }
  public getErrorMessage() {
    return "入力必須です";
  }
}
