import { useEffect, useMemo, useState } from "react";
import { compact, flatten, makeArray } from "~/lib/array-util";

type FormValueKey = string | number | symbol;

export type ValidationErrorType = string;

export interface FormNestValidator<T, E> {
  param: E;
  validate: (v: T) => ValidationErrorType | null;
}

export type FormNestInterface<T, E> = {
  value: T;
  validator: { type: E; message: string | null }[];
  invalid: ValidationErrorType | null;
  onChange: (v: T | ((o: T) => T)) => void;
};

export type FormNestParentInterface<T, E> = FormNestInterface<T, E> & {
  subValidationMap: Record<FormValueKey, ValidationErrorType | null>;
  onSubValidation: (
    id: FormValueKey,
    invalid: ValidationErrorType | null
  ) => void;
};

const validateFormValue = <T, E>({
  value,
  validator
}: {
  value: T;
  validator: FormNestValidator<T, E>[];
}): ValidationErrorType | null => {
  const [first] = compact(validator.map(v => v.validate(value)));
  return first || null;
};

export const useFormNestRoot = <T, E>({
  defaultValue
}: {
  defaultValue: T;
}): FormNestParentInterface<T, E> => {
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

export const useSubFormNest = <T, P, E>({
  key,
  parent,
  pull,
  push,
  validator
}: {
  key: FormValueKey;
  parent: FormNestParentInterface<P, E>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
  validator: FormNestValidator<T, E>[];
}): FormNestInterface<T, E> => {
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
    validator: validator.map(v => {
      const m = v.validate(value);
      return {
        key,
        type: v.param,
        message: m
      };
    })
  };
};

export const useObjectKeyForm = <P, K extends keyof P, E>({
  key,
  parent,
  validator
}: { key: K } & Pick<
  Parameters<typeof useSubFormNest<P[K], P, E>>[0],
  "parent" | "validator"
>) =>
  useSubFormNest<P[K], P, E>({
    key,
    parent,
    pull: o => o[key],
    push: (v, o) => ({ ...o, [key]: v }),
    validator
  });

export const useFormNestReducer = <T, P, E>({
  key,
  parent,
  pull,
  push
}: {
  key: FormValueKey;
  parent: FormNestParentInterface<P, E>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
}): FormNestParentInterface<T, E> => {
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

export const useArrayNest = <T, P, E>({
  key,
  parent,
  validator,
  makeNew,
  pull,
  push
}: {
  key: string;
  parent: FormNestParentInterface<P, E>;
  validator: FormNestValidator<unknown[], E>[];
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
      (value, index): FormNestParentInterface<T, E> => ({
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
