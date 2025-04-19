import { useEffect, useRef, useState } from "react";
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

export type FormParent<T, E> = {
  defaultValue: T;
  onUpdate: (
    v: T | ((p: T) => T),
    s:
      | Record<string, E | null>
      | ((o: Record<string, E | null>) => Record<string, E | null>)
  ) => void;
};

export const useFormNestRoot = <T, E>({
  defaultValue
}: {
  defaultValue: T;
}) => {
  const [value, setValue] = useState(defaultValue);
  const [validationSummary, setValidationSummary] = useState<
    Record<string, E | null>
  >({});
  const parentForm: FormParent<T, E> = {
    defaultValue,
    onUpdate: (v, s) => {
      setValue(v);
      setValidationSummary(s);
    }
  };
  return {
    value,
    validationSummary,
    parentForm
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

export const useSubFormNest = <T, P, E>({
  parentForm,
  pull,
  push,
  errorKey,
  validators
}: {
  parentForm: FormParent<P, E>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
  errorKey: FormValueKey;
} & Pick<Parameters<typeof useFormBase<T, E>>[0], "validators">) =>
  useFormBase<T, E>({
    defaultValue: pull(parentForm.defaultValue),
    validators,
    onUpdate: (v, r) =>
      parentForm.onUpdate(
        p => push(v, p),
        o => {
          const currentError = r.find(rr => rr.errorMessage);
          return {
            ...o,
            [errorKey]: currentError ? currentError.param : null
          };
        }
      )
  });

export const useObjectKeyForm = <P, K extends keyof P, E>({
  key,
  parentForm,
  validators
}: {
  key: K;
  parentForm: FormParent<P, E>;
} & Pick<Parameters<typeof useFormBase<P[K], E>>[0], "validators">) =>
  useSubFormNest<P[K], P, E>({
    parentForm,
    pull: p => p[key],
    push: (v, p) => ({ ...p, [key]: v }),
    errorKey: key,
    validators
  });

const normalizeArrayLength = <T>(arr: T[], l: number, make: () => T) =>
  arr.length >= l ? arr : [...arr, ...makeArray(l - arr.length).map(make)];

export const useArrayNest = <T, P, E>({
  parentForm,
  validators,
  pull,
  push,
  errorKey,
  makeNew
}: {
  makeNew: () => T;
} & Parameters<typeof useSubFormNest<T[], P, E>>[0]) => {
  const calcValidateResult = (v: T[]) =>
    validators.map(d => ({
      param: d.param,
      errorMessage: d.validate(v)
    }));

  const [arr, setArr] = useState<T[]>(pull(parentForm.defaultValue));
  const vrsRef = useRef<Record<string, E | null>[]>([]);
  const [rootValidateResult, setRootValidateResult] = useState<
    ReturnType<typeof calcValidateResult>
  >(calcValidateResult(pull(parentForm.defaultValue)));

  const onChange = (fn: (v: T[]) => T[]) => {
    const v = fn(arr);
    setArr(v);

    const rootValidation = calcValidateResult(v);
    setRootValidateResult(rootValidation);

    const [firstError] = compact([
      ...rootValidation.map(d => (d.errorMessage ? d.param : null)),
      ...flatten(vrsRef.current.map(c => (c ? Object.values(c) : [])))
    ]);
    parentForm.onUpdate(
      p => push(v, p),
      o => ({ ...o, [errorKey]: firstError || null })
    );
  };

  return {
    subForms: arr.map(
      (childValue, index): FormParent<T, E> => ({
        defaultValue: childValue,
        onUpdate: (v, r) =>
          onChange(vv => {
            const newValue = vv.map((vvv, i) =>
              i !== index ? vvv : v instanceof Function ? v(vvv) : v
            );
            vrsRef.current = newValue
              .map((_, i) => vrsRef.current[i] || null)
              .map((vr, i) =>
                i !== index ? vr : r instanceof Function ? r(vr) : r
              );
            return newValue;
          })
      })
    ),
    invalid: null,
    validateResult: rootValidateResult,
    plusCount: () =>
      onChange(v => {
        const arr = [...v, makeNew()];
        vrsRef.current = arr.map((_, i) => vrsRef.current[i] || null);
        return arr;
      }),
    minusCount: () =>
      onChange(v => {
        const arr = v.slice(0, -1);
        vrsRef.current = arr.map((_, i) => vrsRef.current[i] || null);
        return arr;
      })
  };
};
