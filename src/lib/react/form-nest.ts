import { useEffect, useMemo, useState } from "react";
import { compact, flatten, makeArray } from "~/lib/array-util";
import { type ValidationErrorType } from "~/lib/form-validator";

type FormNestValidator<T> = {
  required?: boolean;
  getError?: (v: T) => ValidationErrorType | null;
};

type InvalidParameter = { error: ValidationErrorType | null; isBlank: boolean };

export type FormNestInterface<T> = {
  value: T;
  invalid: InvalidParameter | null;
  onChange: (v: T | ((o: T) => T)) => void;
};

export type FormNestParentInterface<T> = FormNestInterface<T> & {
  subValidationMap: Record<string | number | symbol, InvalidParameter | null>;
  onSubValidation: (
    id: string | number | symbol,
    invalid: InvalidParameter | null
  ) => void;
};

const validateFormValue = <T>({
  value,
  validator
}: {
  value: T;
  validator: FormNestValidator<T>;
}): InvalidParameter | null => {
  const { required = true, getError } = validator;
  const isBlank = required && !value;
  const error = getError ? getError(value) : null;
  return !isBlank && !error
    ? null
    : {
        isBlank,
        error
      };
};

export const useFormNestRoot = <T>({
  defaultValue
}: {
  defaultValue: T;
}): FormNestParentInterface<T> => {
  const [editing, setEditing] = useState(defaultValue);
  const [validMap, setValidMap] = useState<
    Record<string, InvalidParameter | null>
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
    onSubValidation: (k, v) => setValidMap(o => ({ ...o, [k]: v }))
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
  validator: FormNestValidator<T>;
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
    }
  };
};

export const useObjectKeyForm = <P, K extends keyof P>({
  key,
  parent,
  validator
}: {
  key: K;
  parent: FormNestParentInterface<P>;
  validator: FormNestValidator<P[K]>;
}) =>
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
    Record<string, InvalidParameter | null>
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
    onSubValidation: (k, f) => setValidMap(o => ({ ...o, [k]: f }))
  };
};

const normalizeArrayLength = <T>(arr: T[], l: number, make: () => T) =>
  arr.length >= l ? arr : [...arr, ...makeArray(l - arr.length).map(make)];

// TODO: AdminArrayFormUnitと密結合なロジックなので、あっちに統合しちゃってもいいかも
export const useArrayNest = <T, P>({
  key,
  parent,
  minLength = 0,
  maxLength = Infinity,
  makeNew,
  pull,
  push
}: {
  key: string;
  parent: FormNestParentInterface<P>;
  minLength?: number;
  maxLength?: number;
  makeNew: () => T;
  pull: (v: P) => T[];
  push: (v: T[], p: P) => P;
}) => {
  const values = useMemo(() => pull(parent.value), [parent.value]);

  const [validMap, setValidMap] = useState<
    Record<string, InvalidParameter | null>[]
  >([]);

  const lengthValidation = useMemo(
    (): InvalidParameter | null =>
      values.length >= minLength && values.length <= maxLength
        ? null
        : {
            isBlank: false,
            error: {
              type: "bad-array-length",
              minLength,
              maxLength
            }
          },
    [values.length, minLength, maxLength]
  );

  useEffect(() => {
    const v = flatten(validMap.map(m => Object.values(m)));
    const [first] = compact(v);
    parent.onSubValidation(key, lengthValidation || first || null);
  }, [validMap, lengthValidation]);

  return {
    forms: values.map(
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
          })
      })
    ),
    lengthValidation,
    plusCount:
      values.length + 1 <= maxLength
        ? () => parent.onChange(o => push([...values, makeNew()], o))
        : undefined,
    minusCount:
      values.length - 1 >= minLength
        ? () => parent.onChange(o => push(values.slice(0, -1), o))
        : undefined
  };
};
