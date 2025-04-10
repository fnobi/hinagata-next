import styled from "@emotion/styled";
import {
  type ComponentPropsWithoutRef,
  type FunctionComponent,
  type InputHTMLAttributes,
  type ReactNode,
  useMemo
} from "react";
import { THEME_COLOR } from "~/local/emotion-mixin";
import { em, percent, px } from "~/lib/css-util";
import {
  type useArrayNest,
  type FormNestParentInterface,
  type FormNestInterface
} from "~/lib/react/form-nest";
import { formatDatetimeValue } from "~/lib/string-util";
import { type ValidationErrorType } from "~/lib/form-validator";
import { formatClock } from "~/lib/date-util";
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
  color: "#f00",
  fontWeight: "bold",
  textAlign: "right",
  fontSize: px(15)
});

const CounterText = styled.div<{ isError: boolean }>(({ isError }) => ({
  color: isError ? "#f00" : "inherit",
  marginLeft: px(5),
  fontSize: px(15)
}));

const NestSection = styled.div({
  paddingLeft: em(0.5),
  marginBottom: em(0.5),
  borderLeft: `solid ${px(2)} #333`
});

function ValidationErrorRow({ error }: { error: ValidationErrorType }) {
  switch (error.type) {
    case "too-long-text":
      return (
        <ValidationErrorText>
          {error.maxLength}文字以内で入力してください
        </ValidationErrorText>
      );
    case "invalid-email":
      return (
        <ValidationErrorText>
          メールアドレスの形式が不正です
        </ValidationErrorText>
      );
    case "invalid-url":
      return <ValidationErrorText>URLの形式が不正です</ValidationErrorText>;
    case "bad-array-length":
      return (
        <ValidationErrorText>
          要素数が不正です。
          {error.minLength === error.maxLength ? (
            <>{error.minLength}個</>
          ) : (
            <>
              {error.minLength}個以上・{error.maxLength}個以下で
            </>
          )}
          設定してください。
        </ValidationErrorText>
      );
    default:
      return <ValidationErrorText>不明なエラーです</ValidationErrorText>;
  }
}

function FormView({
  invalid = false,
  onSubmit,
  onCancel,
  children
}: {
  invalid?: boolean;
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

export function MockFormFrame<T>({
  form,
  children,
  onCancel,
  onSubmit
}: {
  form: FormNestInterface<T>;
  children: ReactNode;
  onCancel?: () => void;
  onSubmit: (v: T) => void;
}) {
  return (
    <FormView
      invalid={!!form.invalid}
      onSubmit={() => onSubmit(form.value)}
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
  error?: ValidationErrorType | null;
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
      {error ? <ValidationErrorRow error={error} /> : null}
    </div>
  );
}

function StringFormInput({
  form,
  readOnly,
  placeholder,
  autoComplete
}: {
  form: FormNestInterface<string>;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "readOnly" | "placeholder" | "autoComplete"
>) {
  return (
    <input
      type="text"
      value={form.value}
      onChange={e => form.onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      autoComplete={autoComplete}
      style={{
        backgroundColor:
          form.invalid && form.invalid.error ? THEME_COLOR.ERROR : "white",
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
  counter,
  subAction
}: {
  label: string;
  counter?: { maxLength: number }; // TODO: 渡さなくても、formから読み取れるようにしたい
  subAction?: {
    label: string;
    disabled?: boolean;
    onClick: () => void;
  };
} & ComponentPropsWithoutRef<typeof StringFormInput>) {
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
      counter={
        counter
          ? {
              value: form.value.length,
              max: counter.maxLength,
              isError:
                !!form.invalid &&
                !!form.invalid.error &&
                form.invalid.error.type === "too-long-text"
            }
          : undefined
      }
    >
      <InputWrapper>
        <StringFormInput
          form={form}
          readOnly={readOnly}
          autoComplete={autoComplete}
          placeholder={placeholder}
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
  counter,
  form
}: {
  label: string;
  counter?: { maxLength: number };
  form: FormNestInterface<string>;
}) {
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
      counter={
        counter
          ? {
              value: form.value.length,
              max: counter.maxLength,
              isError:
                !!form.invalid &&
                !!form.invalid.error &&
                form.invalid.error.type === "too-long-text"
            }
          : undefined
      }
    >
      <InputWrapper>
        <textarea
          value={form.value}
          onChange={e => form.onChange(e.target.value)}
          style={{
            backgroundColor:
              form.invalid && form.invalid.error ? THEME_COLOR.ERROR : "white"
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
  form: FormNestInterface<number>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  children?: ReactNode;
}) {
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
    >
      <InputWrapper>
        <input
          type="number"
          value={form.value}
          onChange={e => form.onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          style={{
            backgroundColor:
              form.invalid && form.invalid.error ? THEME_COLOR.ERROR : "white"
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
  form: FormNestInterface<number>;
}) {
  const setter = (n: number) =>
    form.onChange(round ? Math.floor(n / round) * round : n);
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
    >
      {form.value ? (
        <>
          <input
            type="datetime-local"
            value={formatDatetimeValue(form.value)}
            onChange={e => setter(new Date(e.target.value).getTime())}
            style={{
              backgroundColor:
                form.invalid && form.invalid.error ? THEME_COLOR.ERROR : "white"
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
  form: FormNestInterface<string>;
}) {
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
    >
      {form.value ? (
        <>
          <input
            type="time"
            value={form.value}
            onChange={e => {
              const v = e.target.value;
              form.onChange(v);
            }}
            style={{
              backgroundColor:
                form.invalid && form.invalid.error ? THEME_COLOR.ERROR : "white"
            }}
          />
          &nbsp;
          <MockActionButton
            action={{
              type: "button",
              onClick: () => form.onChange("")
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
  form: FormNestInterface<boolean>;
}) {
  return (
    <label>
      <input
        type="checkbox"
        checked={form.value}
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
  form: FormNestInterface<string>;
  options: { value: string; label: string }[];
}) {
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
    >
      <select value={form.value} onChange={e => form.onChange(e.target.value)}>
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
  form: FormNestInterface<string>;
  options: { value: string; label: string }[];
}) {
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
    >
      <ul>
        {options.map(({ value: v, label: l }) => (
          <li key={v}>
            <label>
              <input
                type="radio"
                checked={form.value === v}
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
  form: FormNestInterface<number>;
  step?: number;
  min?: number;
  max?: number;
  displayRate?: number;
  postfix?: string;
}) {
  const displayValue = useMemo(
    () => form.value * displayRate,
    [form.value, displayRate]
  );
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.invalid ? form.invalid.error : null}
    >
      <p
        style={{
          color:
            form.invalid && form.invalid.error ? THEME_COLOR.ERROR : "inherit"
        }}
      >
        {displayValue}
        {postfix}
      </p>
      <input
        type="range"
        value={form.value}
        onChange={e => form.onChange(Number(e.target.value))}
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
    <FormCommonRowWrapper label={label}>
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
  form: ReturnType<typeof useArrayNest<T, P>>;
  label: string;
  Item: FunctionComponent<{ form: FormNestParentInterface<T> } & R>;
  calcItemProps: (i: number) => R;
}) {
  return (
    <FormCommonRowWrapper
      label={label}
      error={form.lengthValidation?.error ?? null}
    >
      {form.subForms.map((f, i) => (
        <NestSection key={i}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Item form={f} {...calcItemProps(i)} />
        </NestSection>
      ))}
      <div>
        <MockActionButton
          action={
            form.minusCount
              ? { type: "button", onClick: form.minusCount }
              : null
          }
        >
          −
        </MockActionButton>
        &nbsp;
        <MockActionButton
          action={
            form.plusCount ? { type: "button", onClick: form.plusCount } : null
          }
        >
          ＋
        </MockActionButton>
      </div>
    </FormCommonRowWrapper>
  );
}
