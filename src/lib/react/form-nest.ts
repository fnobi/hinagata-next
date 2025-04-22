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
  onChange: (v: T) => void;
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

const calcValidateResult = <T, E>(
  v: T,
  validators: {
    param: E;
    validate: (v: T) => string | null;
  }[]
) =>
  validators.map(d => ({
    param: d.param,
    errorMessage: d.validate(v)
  }));

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
  onUpdate?: (value: T, validateResult: FormValidationResult<E>[]) => void;
}): FormNestInterface<T, E> => {
  const [editing, setEditing] = useState(defaultValue);
  const [validateResult, setValidateResult] = useState(
    calcValidateResult(defaultValue, validators)
  );

  const currentError = useMemo(
    () => validateResult.find(d => d.errorMessage) || null,
    [validateResult]
  );

  useEffect(() => {
    if (onUpdate) {
      onUpdate(editing, validateResult);
    }
  }, [editing, validateResult]);

  const onChange = (v: T) => {
    const r = calcValidateResult(v, validators);
    setEditing(v);
    setValidateResult(r);
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
    onUpdate: (v, r) =>
      parentForm.onUpdate(
        p => push(v, p),
        o => {
          const [firstError] = compact(
            r.map(d => (d.errorMessage ? d.param : null))
          );
          return {
            ...o,
            [errorKey]: firstError || null
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
  const [arr, setArr] = useState<T[]>(pull(parentForm.defaultValue));
  const vrsRef = useRef<FormValidationSummary<E>[]>([]);
  const [rootValidateResult, setRootValidateResult] = useState<
    ReturnType<typeof calcValidateResult<T, E>>
  >(calcValidateResult(pull(parentForm.defaultValue), validators));

  const currentError = useMemo(
    () => rootValidateResult.find(d => d.errorMessage) || null,
    [rootValidateResult]
  );

  const onChange = (
    fn: (v: T[]) => {
      value: T[];
      validationResult?: { index: number; error: FormValidationSummary<E> };
    }
  ) => {
    const { value: v, validationResult } = fn(arr);
    setArr(v);

    const rootValidation = calcValidateResult(v, validators);
    setRootValidateResult(rootValidation);

    vrsRef.current = v
      .map((_, i) => vrsRef.current[i] || null)
      .map((vr, i) =>
        validationResult && i === validationResult.index
          ? validationResult.error
          : vr
      );

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
      (childValue, index): FormNestParentInterface<T, E> => ({
        defaultValue: childValue,
        onUpdate: (v, r) =>
          onChange(vv => ({
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
    plusCount: () => onChange(v => ({ value: [...v, makeNew()] })),
    minusCount: () => onChange(v => ({ value: v.slice(0, -1) }))
  };
};
