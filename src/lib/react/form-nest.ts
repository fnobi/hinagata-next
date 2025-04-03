import { useEffect, useMemo, useState } from "react";
import { compact, flatten, makeArray } from "~/lib/array-util";

export interface FormNestValidator<T> {
  validate: (v: T) => boolean;
  getErrorMessage(): string;
}

export type ValidationErrorType = {
  index: number;
  message: string;
};

export type FormNestInterface<T> = {
  value: T;
  invalid: ValidationErrorType | null;
  onChange: (v: T | ((o: T) => T)) => void;
  validator: FormNestValidator<T>[];
};

export type FormNestParentInterface<T> = FormNestInterface<T> & {
  subValidationMap: Record<
    string | number | symbol,
    ValidationErrorType | null
  >;
  onSubValidation: (
    id: string | number | symbol,
    invalid: ValidationErrorType | null
  ) => void;
};

const validateFormValue = <T>({
  value,
  validator
}: {
  value: T;
  validator: FormNestValidator<T>[];
}): ValidationErrorType | null => {
  const i = validator.findIndex(v => v.validate(value));
  const v = i >= 0 ? validator[i] : null;
  return v
    ? {
        index: i,
        message: v.getErrorMessage()
      }
    : null;
};

export const useFormNestRoot = <T>({
  defaultValue
}: {
  defaultValue: T;
}): FormNestParentInterface<T> => {
  const [editing, setEditing] = useState(defaultValue);
  const [validMap, setValidMap] = useState<
    Record<string, ValidationErrorType | null>
  >({});

  const invalid = useMemo(() => {
    const v = Object.values(validMap);
    if (!v.length) {
      return null;
    }
    const [first] = compact(v);
    return first;
  }, [validMap]);

  return {
    value: editing,
    onChange: setEditing,
    invalid,
    subValidationMap: validMap,
    onSubValidation: (k, v) => setValidMap(o => ({ ...o, [k]: v })),
    validator: []
  };
};

export const useSubFormNest = <T, P>({
  key,
  parent,
  pull,
  push,
  validator
}: {
  key: string | number | symbol;
  parent: FormNestParentInterface<P>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
  validator: FormNestValidator<T>[];
}): FormNestInterface<T> => {
  const value = useMemo(() => pull(parent.value), [parent.value]);

  useEffect(() => {
    const e = validateFormValue({ value, validator });
    parent.onSubValidation(key, e);
  }, []);

  return {
    value,
    invalid: parent.subValidationMap[key],
    onChange: arg => {
      const v = arg instanceof Function ? arg(value) : arg;
      const e = validateFormValue({ value: v, validator });
      parent.onChange(o => push(v, o));
      parent.onSubValidation(key, e);
    },
    validator
  };
};

export const useObjectKeyForm = <P, K extends keyof P>({
  key,
  parent,
  validator
}: { key: K } & Pick<
  Parameters<typeof useSubFormNest<P[K], P>>[0],
  "parent" | "validator"
>) =>
  useSubFormNest<P[K], P>({
    key,
    parent,
    pull: o => o[key],
    push: (v, o) => ({ ...o, [key]: v }),
    validator
  });

export const useFormNestReducer = <T, P>({
  key,
  parent,
  pull,
  push
}: {
  key: string | number | symbol;
  parent: FormNestParentInterface<P>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
}): FormNestParentInterface<T> => {
  const value = useMemo(() => pull(parent.value), [parent.value]);
  const [validMap, setValidMap] = useState<
    Record<string, ValidationErrorType | null>
  >({});

  useEffect(() => {
    const v = Object.values(validMap);
    const [first] = compact(v);
    parent.onSubValidation(key, first || null);
  }, [validMap]);

  return {
    value,
    invalid: parent.subValidationMap[key],
    onChange: arg =>
      parent.onChange(o => push(arg instanceof Function ? arg(value) : arg, o)),
    subValidationMap: validMap,
    onSubValidation: (k, f) => setValidMap(o => ({ ...o, [k]: f })),
    validator: []
  };
};

const normalizeArrayLength = <T>(arr: T[], l: number, make: () => T) =>
  arr.length >= l ? arr : [...arr, ...makeArray(l - arr.length).map(make)];

export const useArrayNest = <T, P>({
  key,
  parent,
  validator,
  makeNew,
  pull,
  push
}: {
  key: string;
  parent: FormNestParentInterface<P>;
  validator: FormNestValidator<unknown[]>[];
  makeNew: () => T;
  pull: (v: P) => T[];
  push: (v: T[], p: P) => P;
}) => {
  const values = useMemo(() => pull(parent.value), [parent.value]);

  const [validMap, setValidMap] = useState<
    Record<string, ValidationErrorType | null>[]
  >([]);

  const invalid = useMemo(
    (): ValidationErrorType | null =>
      validateFormValue({ value: values, validator }),
    [values.length]
  );

  useEffect(() => {
    setValidMap(l => l.slice(0, values.length));
  }, [values.length]);

  useEffect(() => {
    const v = flatten(validMap.map(m => Object.values(m)));
    const [first] = compact([invalid, ...v]);
    parent.onSubValidation(key, first || null);
  }, [validMap, invalid]);

  return {
    subForms: values.map(
      (value, index): FormNestParentInterface<T> => ({
        value,
        invalid: null,
        onChange: arg =>
          parent.onChange(o => {
            const newValue = arg instanceof Function ? arg(values[index]) : arg;
            return push(
              values.map((vvv, i) => (i === index ? newValue : vvv)),
              o
            );
          }),
        subValidationMap: validMap[index] || {},
        onSubValidation: (k, f) =>
          setValidMap(o => {
            const normalized = normalizeArrayLength(o, index + 1, () => ({}));
            return normalized.map((oo, i) =>
              i === index ? { ...oo, [k]: f } : oo
            );
          }),
        validator: []
      })
    ),
    invalid,
    validator,
    plusCount: () => parent.onChange(o => push([...values, makeNew()], o)),
    minusCount: () => parent.onChange(o => push(values.slice(0, -1), o))
  };
};
