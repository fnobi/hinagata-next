abstract class FormOrganizerBase<T, E = never> {
  protected abstract testFunctions(v: unknown, p: E): boolean;

  protected validators: {
    key: keyof T;
    param: E;
    test: (v: T) => boolean;
  }[] = [];

  public customValidator<K extends keyof T>(
    key: K,
    param: E,
    test: (v: T) => boolean
  ) {
    this.validators.push({
      key,
      param,
      test
    });
    return this;
  }

  public validator<K extends keyof T>(key: K, param: E) {
    return this.customValidator<K>(key, param, v =>
      this.testFunctions(v[key], param)
    );
  }

  public getErrors(v: T) {
    return this.validators.reduce(
      (prev, { key, param, test }) =>
        prev[key] || test(v)
          ? prev
          : {
              ...prev,
              [key]: param
            },
      {} as Record<keyof T, E | null>
    );
  }

  public getValidValue(v: T) {
    const errors = this.getErrors(v);
    return { errors, validValue: Object.values(errors).length ? null : v };
  }

  public getValidatorParams(key?: keyof T) {
    return this.validators.filter(v => !key || v.key === key).map(v => v.param);
  }
}

export default FormOrganizerBase;
