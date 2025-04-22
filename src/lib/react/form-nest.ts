import { useEffect, useMemo, useRef, useState } from "react";
import { compact, flatten } from "~/lib/array-util";

type FormValueKey = string | number | symbol;

type FormValidationResult<E> = { param: E; errorMessage: string | null };

type FormValidationSummary<E> = Record<string, E | null>;

export interface FormNestValidator<T, E> {
  param: E;
  validate: (v: T) => FormValidationResult<E>["errorMessage"];
}

export type FormNestInterface<T, E> = {
  value: T;
  validateResult: FormValidationResult<E>[];
  currentError: FormValidationResult<E> | null;
  onChange: (v: T, s?: E | null) => void;
};

export type FormNestParentInterface<T, E> = {
  defaultValue: T;
  onUpdate: (
    v: T | ((p: T) => T),
    s:
      | FormValidationSummary<E>
      | ((o: FormValidationSummary<E>) => FormValidationSummary<E>)
  ) => void;
};

export const useFormNestRoot = <T, E>({
  defaultValue
}: {
  defaultValue: T;
}) => {
  const [value, setValue] = useState(defaultValue);
  const [validationSummary, setValidationSummary] = useState<
    FormValidationSummary<E>
  >({});
  const parentForm: FormNestParentInterface<T, E> = {
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
    validateResult: FormValidationResult<E>[],
    subError: E | null
  ) => void;
}): FormNestInterface<T, E> => {
  const calcValidateResult = (v: T) =>
    validators.map(d => ({
      param: d.param,
      errorMessage: d.validate(v)
    }));

  const [editing, setEditing] = useState(defaultValue);
  const [validateResult, setValidateResult] = useState(
    calcValidateResult(defaultValue)
  );
  const [subError, setSubError] = useState<E | null>(null);

  const currentError = useMemo(
    () => validateResult.find(d => d.errorMessage) || null,
    [validateResult]
  );

  useEffect(() => {
    if (onUpdate) {
      onUpdate(editing, validateResult, subError);
    }
  }, [editing, validateResult, subError]);

  const onChange = (v: T, s: E | null = null) => {
    const r = calcValidateResult(v);
    setEditing(v);
    setValidateResult(r);
    setSubError(s);
  };

  return {
    value: editing,
    validateResult,
    currentError,
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
  parentForm: FormNestParentInterface<P, E>;
  pull: (p: P) => T;
  push: (v: T, p: P) => P;
  errorKey: FormValueKey;
} & Pick<Parameters<typeof useFormBase<T, E>>[0], "validators">) =>
  useFormBase<T, E>({
    defaultValue: pull(parentForm.defaultValue),
    validators,
    onUpdate: (v, r, s) =>
      parentForm.onUpdate(
        p => push(v, p),
        o => {
          const [firstError] = compact(
            r.map(d => (d.errorMessage ? d.param : null))
          );
          return {
            ...o,
            [errorKey]: firstError || s || null
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
  parentForm: FormNestParentInterface<P, E>;
} & Pick<Parameters<typeof useFormBase<P[K], E>>[0], "validators">) =>
  useSubFormNest<P[K], P, E>({
    parentForm,
    pull: p => p[key],
    push: (v, p) => ({ ...p, [key]: v }),
    errorKey: key,
    validators
  });

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
  const {
    value,
    onChange,
    validateResult: rootValidateResult,
    currentError
  } = useSubFormNest<T[], P, E>({
    parentForm,
    validators,
    pull,
    push,
    errorKey
  });

  const vrsRef = useRef<FormValidationSummary<E>[]>([]);

  const handleChange = (
    fn: (v: T[]) => {
      value: T[];
      validationResult?: { index: number; error: FormValidationSummary<E> };
    }
  ) => {
    const { value: v, validationResult: r } = fn(value);

    vrsRef.current = v
      .map((_, i) => vrsRef.current[i] || null)
      .map((vr, i) => (r && i === r.index ? r.error : vr));

    const [subError] = compact(
      flatten(vrsRef.current.map(c => (c ? Object.values(c) : [])))
    );

    onChange(v, subError || null);
  };

  return {
    subForms: value.map(
      (childValue, index): FormNestParentInterface<T, E> => ({
        defaultValue: childValue,
        onUpdate: (v, r) =>
          handleChange(vv => ({
            value: vv.map((vvv, i) =>
              // eslint-disable-next-line no-nested-ternary
              i === index ? (v instanceof Function ? v(vvv) : v) : vvv
            ),
            validationResult: {
              index,
              error: r instanceof Function ? r(vrsRef.current[index]) : r
            }
          }))
      })
    ),
    validateResult: rootValidateResult,
    currentError,
    plusCount: () => handleChange(v => ({ value: [...v, makeNew()] })),
    minusCount: () => handleChange(v => ({ value: v.slice(0, -1) }))
  };
};
