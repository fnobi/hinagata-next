import styled from "@emotion/styled";
import {
  type ComponentPropsWithoutRef,
  type FunctionComponent,
  type InputHTMLAttributes,
  type ReactNode,
  useMemo,
  useState
} from "react";
import { THEME_COLOR } from "~/local/emotion-mixin";
import { em, percent, px } from "~/lib/css-util";
import {
  type useArrayNest,
  type FormNestParentInterface,
  FormNestInterface
} from "~/lib/react/form-nest";
import { formatDatetimeValue } from "~/lib/string-util";
import { formatClock } from "~/lib/date-util";
import { type AppValidationErrorType } from "~/lib/form-validator";
import { compact } from "~/lib/array-util";
import MockActionButton from "~/components/mock/MockActionButton";

const FormRowHeader = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center"
});

const FormRowTitle = styled.div({
  flexGrow: 1
});

const InputWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "input,textarea": {
    width: percent(100),
    fontSize: "inherit"
  }
});

const FormLayoutGrid = styled.div({
  display: "grid",
  gap: px(15)
});

const Footer = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: px(20),
  gap: px(25)
});

const FlexUnitCell = styled.div({
  flexShrink: 0
});

const ValidationErrorText = styled.div({
  color: THEME_COLOR.ERROR,
  fontWeight: "bold",
  textAlign: "right",
  fontSize: px(15)
});

const CounterText = styled.div<{ isError: boolean }>(({ isError }) => ({
  color: isError ? THEME_COLOR.ERROR : "inherit",
  marginLeft: px(5),
  fontSize: px(15)
}));

const NestSection = styled.div({
  paddingLeft: em(0.5),
  marginBottom: em(0.5),
  borderLeft: `solid ${px(2)} #333`
});

function FormView({
  invalid = false,
  summaryError,
  onSubmit,
  onCancel,
  children
}: {
  invalid?: boolean;
  summaryError?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!invalid) {
          onSubmit();
        }
      }}
    >
      <FormLayoutGrid>{children}</FormLayoutGrid>
      {summaryError ? <div>{summaryError}</div> : null}
      <Footer>
        {onCancel ? (
          <MockActionButton action={{ type: "button", onClick: onCancel }}>
            キャンセル
          </MockActionButton>
        ) : null}
        <MockActionButton action={invalid ? null : { type: "submit" }}>
          OK
        </MockActionButton>
      </Footer>
    </form>
  );
}

export function MockFormFrame({
  children,
  validationSummary,
  onCancel,
  onSubmit
}: {
  children: ReactNode;
  validationSummary: Record<string, AppValidationErrorType | null>;
} & Pick<ComponentPropsWithoutRef<typeof FormView>, "onCancel" | "onSubmit">) {
  const invalid = Object.values(validationSummary).some(f => !!f);
  return (
    <FormView
      invalid={invalid}
      summaryError={JSON.stringify(validationSummary)}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      {children}
    </FormView>
  );
}

function FormCommonRowWrapper({
  label,
  error,
  counter,
  children
}: {
  label: string;
  error: { param: AppValidationErrorType; errorMessage: string | null } | null;
  counter?: { value: number; max: number; isError: boolean };
  children: ReactNode;
}) {
  return (
    <div>
      <FormRowHeader>
        <FormRowTitle>{label}</FormRowTitle>
        {counter ? (
          <CounterText isError={counter.isError}>
            {counter.value}/{counter.max}
          </CounterText>
        ) : null}
      </FormRowHeader>
      {children}
      {error ? (
        <ValidationErrorText>{error.errorMessage}</ValidationErrorText>
      ) : null}
    </div>
  );
}

function StringFormInput({
  defaultValue,
  onChange,
  readOnly,
  placeholder,
  autoComplete,
  invalid = false
}: Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "onChange" | "readOnly" | "placeholder" | "autoComplete"
> & { invalid?: boolean }) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      autoComplete={autoComplete}
      style={{
        backgroundColor: invalid ? THEME_COLOR.ERROR : THEME_COLOR.WHITE,
        display: "block",
        width: percent(100)
      }}
    />
  );
}

export function MockStringFormRow({
  form,
  readOnly,
  placeholder,
  autoComplete,
  label,
  subAction
}: {
  form: FormNestInterface<string, AppValidationErrorType>;
  label: string;
  subAction?: {
    label: string;
    disabled?: boolean;
    onClick: () => void;
  };
} & Omit<
  ComponentPropsWithoutRef<typeof StringFormInput>,
  "value" | "onChange" | "invalid"
>) {
  const [value, setValue] = useState(form.defaultValue);
  const counter = useMemo(() => {
    const [d] = compact(
      form.validateResult.map(({ param, errorMessage }) =>
        param.type === "too-long-string" ? { param, errorMessage } : null
      )
    );
    if (!d) {
      return undefined;
    }
    return {
      value: value.length,
      max: d.param.maxLength,
      isError: !!d.errorMessage
    };
  }, [value, form.validateResult]);
  const handleChange = (v: string) => {
    setValue(v);
    form.onChange(v);
  };
  const validCurrentError = useMemo(
    () =>
      form.currentError && form.currentError.param.type !== "required"
        ? form.currentError
        : null,
    [form.currentError]
  );
  return (
    <FormCommonRowWrapper
      label={label}
      error={validCurrentError}
      counter={counter}
    >
      <InputWrapper>
        <StringFormInput
          defaultValue={form.defaultValue}
          onChange={e => handleChange(e.target.value)}
          readOnly={readOnly}
          autoComplete={autoComplete}
          placeholder={placeholder}
          invalid={!!validCurrentError}
        />
        {subAction ? (
          <>
            &nbsp;
            <MockActionButton
              action={
                subAction.disabled
                  ? null
                  : { type: "button", onClick: subAction.onClick }
              }
            >
              {subAction.label}
            </MockActionButton>
          </>
        ) : null}
      </InputWrapper>
    </FormCommonRowWrapper>
  );
}

export function MockTextFormRow({
  label,
  form
}: {
  label: string;
  form: FormNestInterface<string, AppValidationErrorType>;
}) {
  const [value, setValue] = useState(form.defaultValue);
  const counter = useMemo(() => {
    const [d] = compact(
      form.validateResult.map(({ param, errorMessage }) =>
        param.type === "too-long-string" ? { param, errorMessage } : null
      )
    );
    if (!d) {
      return undefined;
    }
    return {
      value: value.length,
      max: d.param.maxLength,
      isError: !!d.errorMessage
    };
  }, [value, form.validateResult]);
  const handleChange = (v: string) => {
    setValue(v);
    form.onChange(v);
  };
  const validCurrentError = useMemo(
    () =>
      form.currentError && form.currentError.param.type !== "required"
        ? form.currentError
        : null,
    [form.currentError]
  );
  return (
    <FormCommonRowWrapper
      label={label}
      error={validCurrentError}
      counter={counter}
    >
      <InputWrapper>
        <textarea
          defaultValue={form.defaultValue}
          onChange={e => handleChange(e.target.value)}
          style={{
            backgroundColor: validCurrentError
              ? THEME_COLOR.ERROR
              : THEME_COLOR.WHITE
          }}
        />
      </InputWrapper>
    </FormCommonRowWrapper>
  );
}

export function MockNumberFormRow({
  label,
  form,
  min,
  max,
  step,
  unit,
  children
}: {
  label: string;
  form: FormNestInterface<number, AppValidationErrorType>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  children?: ReactNode;
}) {
  return (
    <FormCommonRowWrapper label={label} error={form.currentError}>
      <InputWrapper>
        <input
          type="number"
          defaultValue={form.defaultValue}
          onChange={e => form.onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          style={{
            backgroundColor: form.currentError
              ? THEME_COLOR.ERROR
              : THEME_COLOR.WHITE
          }}
        />
        {unit ? <FlexUnitCell>&nbsp;{unit}</FlexUnitCell> : null}
      </InputWrapper>
      {children}
    </FormCommonRowWrapper>
  );
}

export function MockDateTimeFormRow({
  label,
  round,
  form
}: {
  label: string;
  round?: number;
  form: FormNestInterface<number, AppValidationErrorType>;
}) {
  const [value, setValue] = useState(form.defaultValue);
  const setter = (n: number) => {
    const v = round ? Math.floor(n / round) * round : n;
    setValue(v);
    form.onChange(v);
  };
  return (
    <FormCommonRowWrapper label={label} error={form.currentError}>
      {value ? (
        <>
          <input
            type="datetime-local"
            defaultValue={formatDatetimeValue(value)}
            onChange={e => setter(new Date(e.target.value).getTime())}
            style={{
              backgroundColor: form.currentError
                ? THEME_COLOR.ERROR
                : THEME_COLOR.WHITE
            }}
          />
          &nbsp;
          <MockActionButton
            action={{
              type: "button",
              onClick: () => setter(0)
            }}
          >
            クリア
          </MockActionButton>
        </>
      ) : (
        <p>
          <MockActionButton
            action={{
              type: "button",
              onClick: () => setter(Date.now())
            }}
          >
            現在時刻で設定
          </MockActionButton>
        </p>
      )}
    </FormCommonRowWrapper>
  );
}

export function MockClockFormRow({
  label,
  form
}: {
  label: string;
  form: FormNestInterface<string, AppValidationErrorType>;
}) {
  const [value, setValue] = useState(form.defaultValue);
  const handleChange = (v: string) => {
    setValue(v);
    form.onChange(v);
  };
  return (
    <FormCommonRowWrapper label={label} error={form.currentError}>
      {value ? (
        <>
          <input
            type="time"
            value={value}
            onChange={e => handleChange(e.target.value)}
            style={{
              backgroundColor: form.currentError
                ? THEME_COLOR.ERROR
                : THEME_COLOR.WHITE
            }}
          />
          &nbsp;
          <MockActionButton
            action={{
              type: "button",
              onClick: () => handleChange("")
            }}
          >
            クリア
          </MockActionButton>
        </>
      ) : (
        <p>
          <MockActionButton
            action={{
              type: "button",
              onClick: () => form.onChange(formatClock(new Date()))
            }}
          >
            現在時刻で設定
          </MockActionButton>
        </p>
      )}
    </FormCommonRowWrapper>
  );
}

export function MockCheckboxFormRow({
  children,
  form
}: {
  children: ReactNode;
  form: FormNestInterface<boolean, AppValidationErrorType>;
}) {
  return (
    <label>
      <input
        type="checkbox"
        defaultChecked={form.defaultValue}
        onChange={e => form.onChange(e.target.checked)}
      />
      &nbsp;{children}
    </label>
  );
}

export function MockPulldownFormRow({
  label,
  form,
  options
}: {
  label: string;
  form: FormNestInterface<string, AppValidationErrorType>;
  options: { value: string; label: string }[];
}) {
  return (
    <FormCommonRowWrapper label={label} error={form.currentError}>
      <select
        defaultValue={form.defaultValue}
        onChange={e => form.onChange(e.target.value)}
      >
        <option value="">-</option>
        {options.map(({ value: v, label: l }) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </FormCommonRowWrapper>
  );
}
export function MockRadioSelectFormRow({
  label,
  form,
  options
}: {
  label: string;
  form: FormNestInterface<string, AppValidationErrorType>;
  options: { value: string; label: string }[];
}) {
  return (
    <FormCommonRowWrapper label={label} error={form.currentError}>
      <ul>
        {options.map(({ value: v, label: l }) => (
          <li key={v}>
            <label>
              <input
                type="radio"
                defaultChecked={form.defaultValue === v}
                onChange={e => {
                  if (e.target.checked) {
                    form.onChange(v);
                  }
                }}
              />
              &nbsp;
              {l}
            </label>
          </li>
        ))}
      </ul>
    </FormCommonRowWrapper>
  );
}

export function MockRangeFormRow({
  label,
  form,
  step = 1,
  min,
  max,
  displayRate = 1,
  postfix
}: {
  label: string;
  form: FormNestInterface<number, AppValidationErrorType>;
  step?: number;
  min?: number;
  max?: number;
  displayRate?: number;
  postfix?: string;
}) {
  const [value, setValue] = useState(form.defaultValue);
  const displayValue = useMemo(() => value * displayRate, [value, displayRate]);
  const handleChange = (v: number) => {
    setValue(v);
    form.onChange(v);
  };
  return (
    <FormCommonRowWrapper label={label} error={form.currentError}>
      <p
        style={{
          color: form.currentError ? THEME_COLOR.ERROR : "inherit"
        }}
      >
        {displayValue}
        {postfix}
      </p>
      <input
        type="range"
        defaultValue={form.defaultValue}
        onChange={e => handleChange(Number(e.target.value))}
        step={step}
        min={min}
        max={max}
      />
    </FormCommonRowWrapper>
  );
}

export function MockFileFormRow({
  label,
  onChange
}: {
  label: string;
  onChange: (f: FileList | null) => void;
}) {
  return (
    <FormCommonRowWrapper label={label} error={null}>
      <input type="file" onChange={e => onChange(e.target.files)} />
    </FormCommonRowWrapper>
  );
}

export function MockArrayFormRow<T, P, R>({
  form,
  label,
  Item,
  calcItemProps
}: {
  form: ReturnType<typeof useArrayNest<T, P, AppValidationErrorType>>;
  label: string;
  Item: FunctionComponent<
    { parentForm: FormNestParentInterface<T, AppValidationErrorType> } & R
  >;
  calcItemProps: (i: number) => R;
}) {
  const { canPlus, canMinus } = useMemo(() => {
    const { length: l } = form.subForms;
    const [param] = form.validateResult.map(v =>
      v.param.type === "invalid-array-length" ? v.param : null
    );
    const { minLength = 0, maxLength = -1 } = param || {};
    return {
      canPlus: maxLength >= 0 ? maxLength > l : true,
      canMinus: minLength < l
    };
  }, [form.subForms.length]);

  return (
    <FormCommonRowWrapper label={label} error={form.currentError}>
      {form.subForms.map((f, i) => (
        <NestSection key={i}>
          <FormLayoutGrid>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Item parentForm={f} {...calcItemProps(i)} />
          </FormLayoutGrid>
        </NestSection>
      ))}
      <div>
        <MockActionButton
          action={
            canMinus ? { type: "button", onClick: form.minusCount } : null
          }
        >
          −
        </MockActionButton>
        &nbsp;
        <MockActionButton
          action={canPlus ? { type: "button", onClick: form.plusCount } : null}
        >
          ＋
        </MockActionButton>
      </div>
    </FormCommonRowWrapper>
  );
}
