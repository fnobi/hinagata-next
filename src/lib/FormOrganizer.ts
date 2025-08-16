import {
  type FormOrganizerValidator,
  type ValidationErrorType
} from "~/lib/form-validator";

class FormOrganizer<T> {
  protected validatorList: {
    key: keyof T;
    validator: FormOrganizerValidator<T>;
  }[] = [];

  public formValidator(c: FormOrganizer<T>["validatorList"][number]) {
    this.validatorList.push(c);
    return this;
  }

  public fieldValidator<K extends keyof T>(
    key: K,
    { param, test }: FormOrganizerValidator<T[K]>
  ) {
    return this.formValidator({
      key,
      validator: {
        param,
        test: v => test(v[key])
      }
    });
  }

  public getErrors(v: T) {
    return this.validatorList.reduce(
      (prev, { key, validator: vvvv }) =>
        prev[key] || vvvv.test(v)
          ? prev
          : {
              ...prev,
              [key]: vvvv.param
            },
      {} as Record<keyof T, ValidationErrorType | null>
    );
  }

  public getValidValue(v: T) {
    const errors = this.getErrors(v);
    return { errors, validValue: Object.values(errors).length ? null : v };
  }

  public get maxLengthes() {
    return this.validatorList.reduce(
      (prev, { key, validator }) =>
        validator.param.type === "string-max-length"
          ? {
              ...prev,
              [key]: prev[key] || validator.param.maxLength
            }
          : prev,
      {} as Record<keyof T, number | undefined>
    );
  }
}

export default FormOrganizer;
