import { useEffect, useMemo, useState } from "react";
import { compact, flatten, makeArray } from "~/lib/array-util";

export interface FormNestValidator<T, E> {
  type: E;
  validate: (v: T) => boolean;
  getErrorMessage(): string;
}

export type TmpErrorType<E> = { type: E; message: string };

export type FormNestInterface<T, E> = {
  value: T;
  invalid: TmpErrorType<E> | null;
  onChange: (v: T | ((o: T) => T)) => void;
  validator: FormNestValidator<T, E>[];
};

export type FormNestParentInterface<T, E> = FormNestInterface<T, E> & {
  subValidationMap: Record<string | number | symbol, TmpErrorType<E> | null>;
  onSubValidation: (
    id: string | number | symbol,
    invalid: TmpErrorType<E> | null
  ) => void;
};

const validateFormValue = <T, E>({
  value,
  validator
}: {
  value: T;
  validator: FormNestValidator<T, E>[];
}): TmpErrorType<E> | null => {
  const v = validator.find(v => v.validate(value));
  return v ? { type: v.type, message: v.getErrorMessage() } : null;
};

export const useFormNestRoot = <T, E>({
  defaultValue
}: {
  defaultValue: T;
}): FormNestParentInterface<T, E> => {
  const [editing, setEditing] = useState(defaultValue);
  const [validMap, setValidMap] = useState<
    Record<string, TmpErrorType<E> | null>
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
  key: string | number | symbol;
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
    validator
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
  key: string | number | symbol;
  parent: FormNestParentInterface<P, E>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
}): FormNestParentInterface<T, E> => {
  const value = useMemo(() => pull(parent.value), [parent.value]);
  const [validMap, setValidMap] = useState<
    Record<string, TmpErrorType<E> | null>
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
  minLength = 0,
  maxLength = Infinity,
  makeLengthError,
  makeNew,
  pull,
  push
}: {
  key: string;
  parent: FormNestParentInterface<P, E>;
  minLength?: number;
  maxLength?: number;
  makeLengthError: () => TmpErrorType<E>;
  makeNew: () => T;
  pull: (v: P) => T[];
  push: (v: T[], p: P) => P;
}) => {
  const values = useMemo(() => pull(parent.value), [parent.value]);

  const [validMap, setValidMap] = useState<
    Record<string, TmpErrorType<E> | null>[]
  >([]);

  const lengthValidation = useMemo(
    (): TmpErrorType<E> | null =>
      values.length >= minLength && values.length <= maxLength
        ? null
        : makeLengthError(),
    [values.length, minLength, maxLength]
  );

  useEffect(() => {
    setValidMap(l => l.slice(0, values.length));
  }, [values.length]);

  useEffect(() => {
    const v = flatten(validMap.map(m => Object.values(m)));
    const [first] = compact(v);
    parent.onSubValidation(key, lengthValidation || first || null);
  }, [validMap, lengthValidation]);

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
