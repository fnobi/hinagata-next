import { useCallback, useEffect, useMemo, useState } from "react";
import { compact, flatten, makeArray } from "~/lib/array-util";

type FormValueKey = string | number | symbol;

export interface FormNestValidator<T, E> {
  param: E;
  validate: (v: T) => string | null;
}

export type FormNestInterface<T, E> = {
  value: T;
  validator: { param: E; message: string | null }[];
  invalid: string | null;
  onChange: (v: T | ((o: T) => T)) => void;
};

export type FormNestParentInterface<T, E> = FormNestInterface<T, E> & {
  subValidationMap: Record<FormValueKey, string | null>;
  onSubValidation: (id: FormValueKey, invalid: string | null) => void;
};

const validateFormValue = <T, E>({
  value,
  validator
}: {
  value: T;
  validator: FormNestValidator<T, E>[];
}): string | null => {
  const [first] = compact(validator.map(v => v.validate(value)));
  return first || null;
};

export const useFormNestRoot = <T, E>({
  defaultValue
}: {
  defaultValue: T;
}): FormNestParentInterface<T, E> => {
  const [editing, setEditing] = useState(defaultValue);
  const [validMap, setValidMap] = useState<Record<string, string | null>>({});

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
  validator: vvv
}: {
  key: FormValueKey;
  parent: FormNestParentInterface<P, E>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
  validator: FormNestValidator<T, E>[];
}): FormNestInterface<T, E> => {
  const value = useMemo(() => pull(parent.value), [parent.value]);

  const sendValidation = useCallback(
    (v: T) =>
      parent.onSubValidation(
        key,
        validateFormValue({ value: v, validator: vvv })
      ),
    [value, vvv]
  );

  useEffect(() => {
    sendValidation(value);
  }, []);

  const onChange: FormNestInterface<T, E>["onChange"] = arg => {
    const v = arg instanceof Function ? arg(value) : arg;
    parent.onChange(o => push(v, o));
    sendValidation(v);
  };

  const validator: FormNestInterface<T, E>["validator"] = vvv.map(v => ({
    param: v.param,
    message: v.validate(value)
  }));

  const invalid = parent.subValidationMap[key];

  return {
    value,
    invalid,
    onChange,
    validator
  };
};

export const useFormBase = <T, E>({
  defaultValue,
  validators,
  onUpdate
}: {
  defaultValue: T;
  validators: {
    param: E;
    validate: (v: T) => string | null;
  }[];
  onUpdate?: (
    value: T,
    validateResult: {
      param: E;
      errorMessage: string | null;
    }[]
  ) => void;
}) => {
  const calcValidateResult = (v: T) =>
    validators.map(d => ({
      param: d.param,
      errorMessage: d.validate(v)
    }));

  const [editing, setEditing] = useState(defaultValue);
  const [validateResult, setValidateResult] = useState(
    calcValidateResult(defaultValue)
  );

  useEffect(() => {
    if (onUpdate) {
      onUpdate(editing, validateResult);
    }
  }, [editing, validateResult]);

  const onChange = (v: T) => {
    const r = calcValidateResult(v);
    setEditing(v);
    setValidateResult(r);
  };

  return {
    value: editing,
    validateResult,
    onChange
  };
};

export const useObjectKeyForm = <P, K extends keyof P, E>({
  key,
  parentForm,
  validators
}: {
  key: K;
  parentForm: {
    defaultValue: P;
    onUpdate: (
      v: P | ((p: P) => P),
      s:
        | Record<string, E | null>
        | ((o: Record<string, E | null>) => Record<string, E | null>)
    ) => void;
  };
} & Pick<Parameters<typeof useFormBase<P[K], E>>[0], "validators">) => {
  return useFormBase<P[K], E>({
    defaultValue: parentForm.defaultValue[key],
    validators,
    onUpdate: (v, r) => {
      const currentError = r.find(rr => rr.errorMessage);
      parentForm.onUpdate(
        p => ({ ...p, [key]: v }),
        o => ({
          ...o,
          [key]: currentError ? currentError.param : null
        })
      );
    }
  });
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

  const [validMap, setValidMap] = useState<Record<string, string | null>[]>([]);

  const invalid = useMemo(
    (): string | null => validateFormValue({ value: values, validator }),
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
