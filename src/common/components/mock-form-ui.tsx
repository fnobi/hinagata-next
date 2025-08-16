import styled from "@emotion/styled";
import {
  type ComponentPropsWithoutRef,
  type FunctionComponent,
  type InputHTMLAttributes,
  type ReactNode,
  useMemo
} from "react";
import MockActionButton from "~/common/components/MockActionButton";
import { type ValidationErrorType } from "~/common/lib/form-validator";
import {
  alphaColor,
  em,
  percent,
  PRIMITIVE_COLOR,
  px
} from "~/common/lib/css-util";
import { formatClock } from "~/common/lib/date-util";
import { formatDatetimeValue } from "~/common/lib/string-util";
import { parseNumber } from "~/common/lib/parser-helper";
import type CommonActionParameter from "~/common/scheme/CommonActionParameter";

const SILENT_ERROR_TYPES: ValidationErrorType["type"][] = ["required"];

const errorBgColor = (e: ValidationErrorType | null) =>
  e && !SILENT_ERROR_TYPES.includes(e.type) ? PRIMITIVE_COLOR.ERROR : "inherit";

const useTextCounter = ({
  value,
  maxLength,
  error
}: {
  value: string;
  maxLength?: number;
  error: ValidationErrorType | null;
}) =>
  useMemo(() => {
    if (!maxLength) {
      return undefined;
    }
    return {
      value: value.length,
      max: maxLength,
      isError: error && error.type === "string-max-length" ? error : null
    };
  }, [error, maxLength, value.length]);

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
  color: PRIMITIVE_COLOR.ERROR,
  fontWeight: "bold",
  textAlign: "right",
  fontSize: px(15)
});

const CounterText = styled.div<{ error: ValidationErrorType | null }>(
  ({ error }) => ({
    color: errorBgColor(error),
    marginLeft: px(5),
    fontSize: px(15)
  })
);

const NestSection = styled.div({
  paddingLeft: em(0.5),
  marginBottom: em(0.5),
  borderLeft: `solid ${px(2)} #333`
});

export const MockFormFrame = <T,>({
  children,
  validValue,
  submitLabel = "OK",
  cancelLabel = "キャンセル",
  onCancel,
  onSubmit
}: {
  children: ReactNode;
  validValue: T | null;
  onSubmit: (v: T) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      if (validValue) {
        onSubmit(validValue);
      }
    }}
  >
    <FormLayoutGrid>{children}</FormLayoutGrid>
    <Footer>
      {onCancel ? (
        <MockActionButton action={{ type: "button", onClick: onCancel }}>
          {cancelLabel}
        </MockActionButton>
      ) : null}
      <MockActionButton action={validValue ? { type: "submit" } : null}>
        {submitLabel}
      </MockActionButton>
    </Footer>
  </form>
);

const FormCommonRowWrapper = ({
  label,
  error,
  counter,
  children
}: {
  label: string;
  error: ValidationErrorType | null;
  counter?: {
    value: number;
    max: number;
    isError: ValidationErrorType | null;
  };
  children: ReactNode;
}) => (
  <div>
    <FormRowHeader>
      <FormRowTitle>{label}</FormRowTitle>
      {counter ? (
        <CounterText error={counter.isError}>
          {counter.value}/{counter.max}
        </CounterText>
      ) : null}
    </FormRowHeader>
    {children}
    {error && !SILENT_ERROR_TYPES.includes(error.type) ? (
      <ValidationErrorText>{error.type}</ValidationErrorText>
    ) : null}
  </div>
);

export type CommonFormFieldProps<T> = {
  value: T;
  onChange: (v: T) => void;
};

type FormRowCommonProps<T> = CommonFormFieldProps<T> &
  Pick<
    ComponentPropsWithoutRef<typeof FormCommonRowWrapper>,
    "error" | "label"
  >;

const StringFormInput = ({
  type = "text",
  value,
  readOnly,
  placeholder,
  autoComplete,
  maxLength,
  error,
  onChange
}: Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "value"
  | "readOnly"
  | "placeholder"
  | "autoComplete"
  | "maxLength"
  | "onChange"
> & { type?: "text" | "password"; error: ValidationErrorType | null }) => {
  const bgColor = useMemo(() => {
    if (readOnly) {
      return alphaColor(PRIMITIVE_COLOR.BLACK, 0.3);
    }
    return errorBgColor(error);
  }, [error, readOnly]);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      autoComplete={autoComplete}
      maxLength={maxLength}
      style={{
        backgroundColor: bgColor,
        display: "block",
        width: percent(100)
      }}
    />
  );
};

export const MockStringFormRow = ({
  value,
  error,
  type,
  readOnly,
  placeholder,
  autoComplete,
  maxLength,
  label,
  subAction,
  onChange
}: {
  subAction?: {
    label: string;
    disabled?: boolean;
    onClick: () => void;
  };
} & Omit<
  ComponentPropsWithoutRef<typeof StringFormInput>,
  "value" | "onChange"
> &
  FormRowCommonProps<string>) => {
  const counter = useTextCounter({ value, maxLength, error });
  return (
    <FormCommonRowWrapper label={label} error={error} counter={counter}>
      <InputWrapper>
        <StringFormInput
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          autoComplete={autoComplete}
          placeholder={placeholder}
          error={error}
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
};

export const MockTextFormRow = ({
  value,
  error,
  readOnly,
  placeholder,
  autoComplete,
  maxLength,
  label,
  onChange
}: FormRowCommonProps<string> &
  Pick<
    InputHTMLAttributes<HTMLTextAreaElement>,
    "readOnly" | "placeholder" | "autoComplete" | "maxLength"
  >) => {
  const counter = useTextCounter({ value, maxLength, error });
  return (
    <FormCommonRowWrapper label={label} error={error} counter={counter}>
      <InputWrapper>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            backgroundColor: errorBgColor(error)
          }}
        />
      </InputWrapper>
    </FormCommonRowWrapper>
  );
};

export const MockNumberFormRow = ({
  label,
  error,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  children
}: Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "readOnly"
  | "placeholder"
  | "autoComplete"
  | "maxLength"
  | "min"
  | "max"
  | "step"
> & {
  unit?: string;
  children?: ReactNode;
} & FormRowCommonProps<number>) => (
  <FormCommonRowWrapper label={label} error={error}>
    <InputWrapper>
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseNumber(e.target.value))}
        min={min}
        max={max}
        step={step}
        style={{ backgroundColor: errorBgColor(error) }}
      />
      {unit ? <FlexUnitCell>&nbsp;{unit}</FlexUnitCell> : null}
    </InputWrapper>
    {children}
  </FormCommonRowWrapper>
);

export const MockDateTimeFormRow = ({
  label,
  error,
  round,
  value,
  onChange
}: { round?: number } & FormRowCommonProps<number>) => {
  const setter = (n: number) =>
    onChange(round ? Math.floor(n / round) * round : n);
  return (
    <FormCommonRowWrapper label={label} error={error}>
      {value ? (
        <>
          <input
            type="datetime-local"
            value={formatDatetimeValue(value)}
            onChange={e => setter(new Date(e.target.value).getTime())}
            style={{ backgroundColor: errorBgColor(error) }}
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
};

export const MockClockFormRow = ({
  label,
  value,
  onChange,
  error
}: FormRowCommonProps<string>) => (
  <FormCommonRowWrapper label={label} error={error}>
    {value ? (
      <>
        <input
          type="time"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ backgroundColor: errorBgColor(error) }}
        />
        &nbsp;
        <MockActionButton
          action={{
            type: "button",
            onClick: () => onChange("")
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
            onClick: () => onChange(formatClock(new Date()))
          }}
        >
          現在時刻で設定
        </MockActionButton>
      </p>
    )}
  </FormCommonRowWrapper>
);

export const MockCheckboxFormInput = ({
  children,
  value,
  onChange
}: {
  children: ReactNode;
} & CommonFormFieldProps<boolean>) => (
  <label>
    <input
      type="checkbox"
      checked={value}
      onChange={e => onChange(e.target.checked)}
    />
    &nbsp;{children}
  </label>
);

export const MockPulldownFormRow = <T extends string>({
  label,
  value,
  error,
  options,
  onChange
}: {
  options: { value: T; label: string }[];
} & FormRowCommonProps<T>) => (
  <FormCommonRowWrapper label={label} error={error}>
    <select value={value || ""} onChange={e => onChange(e.target.value as T)}>
      <option value="">-</option>
      {options.map(({ value: v, label: l }) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  </FormCommonRowWrapper>
);

export const MockRadioSelectFormRow = <T extends string>({
  label,
  value,
  onChange,
  error,
  options
}: { options: { value: T; label: string }[] } & FormRowCommonProps<T>) => (
  <FormCommonRowWrapper label={label} error={error}>
    <ul>
      {options.map(({ value: v, label: l }) => (
        <li key={v}>
          <label>
            <input
              type="radio"
              checked={value === v}
              onChange={e => {
                if (e.target.checked) {
                  onChange(v);
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

export const MockRangeFormRow = ({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  displayRate = 1,
  postfix,
  error
}: {
  displayRate?: number;
  postfix?: string;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "min" | "max" | "step"> &
  FormRowCommonProps<number>) => {
  const displayValue = useMemo(() => value * displayRate, [value, displayRate]);
  return (
    <FormCommonRowWrapper label={label} error={error}>
      <p
        style={{
          color: errorBgColor(error)
        }}
      >
        {displayValue}
        {postfix}
      </p>
      <input
        type="range"
        value={value}
        onChange={e => onChange(parseNumber(e.target.value))}
        step={step}
        min={min}
        max={max}
      />
    </FormCommonRowWrapper>
  );
};

export const MockFileFormRow = ({
  label,
  onChange
}: {
  label: string;
  onChange: (f: FileList | null) => void;
}) => (
  <FormCommonRowWrapper label={label} error={null}>
    <input type="file" onChange={e => onChange(e.target.files)} />
  </FormCommonRowWrapper>
);

export const MockArrayFormRow = <T,>({
  label,
  value,
  makeNew,
  onChange,
  error,
  Item
}: {
  makeNew: (s: unknown) => T;
  Item: FunctionComponent<CommonFormFieldProps<T>>;
} & FormRowCommonProps<T[]>) => {
  const handleMinus = useMemo(
    (): CommonActionParameter | null =>
      value.length > 0
        ? {
            type: "button",
            onClick: () => onChange(value.slice(0, -1))
          }
        : null,
    [onChange, value]
  );
  const handlePlus = useMemo(
    (): CommonActionParameter | null => ({
      type: "button",
      onClick: () => onChange([...value, makeNew(null)])
    }),
    [makeNew, onChange, value]
  );
  const rows = useMemo(
    (): CommonFormFieldProps<T>[] =>
      value.map((v, i) => ({
        value: v,
        onChange: (nv: T) =>
          onChange(value.map((vv, ii) => (ii === i ? nv : vv)))
      })),
    [onChange, value]
  );
  return (
    <FormCommonRowWrapper label={label} error={error}>
      <div>
        {rows.map((r, i) => (
          <NestSection key={i}>
            <FormLayoutGrid>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Item {...r} />
            </FormLayoutGrid>
          </NestSection>
        ))}
      </div>
      <div>
        <MockActionButton action={handleMinus}>-</MockActionButton>
        &nbsp;
        <MockActionButton action={handlePlus}>+</MockActionButton>
      </div>
    </FormCommonRowWrapper>
  );
};
