/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { compact } from "~/lib/array-util";
import { type FormNestValidator } from "~/lib/react/form-nest";

const EMAIL_REGEXP =
  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

const URL_REGEXP = /^https?:\/\//;

export class MaxLengthValidator implements FormNestValidator<string> {
  public readonly maxLength: number;

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

export class EmailValidator implements FormNestValidator<string> {
  public validate(v: string) {
    return !!v && !EMAIL_REGEXP.test(v);
  }

  public getErrorMessage() {
    return "メールアドレスの形式が不正です";
  }
}

export class UrlValidator implements FormNestValidator<string> {
  public validate(v: string) {
    return !!v && !URL_REGEXP.test(v);
  }

  public getErrorMessage() {
    return "URLの形式が不正です";
  }
}

export class RequiredValidator implements FormNestValidator<string> {
  public validate(v: string) {
    return !v;
  }

  public getErrorMessage() {
    return "入力必須です";
  }
}

export class ArrayLengthValidator implements FormNestValidator<unknown[]> {
  private minLength: number;

  private maxLength: number;

  public constructor({
    minLength = -1,
    maxLength = -1
  }: {
    minLength?: number;
    maxLength?: number;
  }) {
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  public validate(values: unknown[]) {
    return (
      (this.minLength >= 0 && values.length < this.minLength) ||
      (this.maxLength >= 0 && values.length > this.maxLength)
    );
  }

  public getErrorMessage() {
    const l =
      this.minLength === this.maxLength
        ? `${this.maxLength}個`
        : compact([
            this.minLength >= 0 ? `${this.minLength}個以上` : null,
            this.maxLength >= 0 ? `${this.maxLength}個以下` : null
          ]).join("");
    return `要素数が不正です。${l}で設定してください。`;
  }
}
