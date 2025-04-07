import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import {
  type AppValidationErrorType,
  emailValidator,
  maxLengthValidator,
  requiredValidator,
  urlValidator
} from "~/lib/form-validator";
import { useFormNestRoot } from "~/lib/react/form-nest";
import type DummyProfile from "~/scheme/DummyProfile";
import { type DummyProfileLink } from "~/scheme/DummyProfile";
import { FormView, MockFormFrame } from "~/components/mock/mock-form-ui";

const useFormBase = <T, E>({
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

const useObjectKeyForm = <P, K extends keyof P, E>({
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

function StringFormRow({
  label,
  form
}: {
  label: string;
  form: ReturnType<typeof useFormBase<string, AppValidationErrorType>>;
}) {
  return (
    <div>
      <p>{label}</p>
      <p>
        <input
          type="text"
          value={form.value}
          onChange={e => form.onChange(e.target.value)}
        />
      </p>
      {form.validateResult
        .filter(r => !!r.errorMessage)
        .map(r => (
          <p key={r.param.type}>{r.errorMessage}</p>
        ))}
    </div>
  );
}

function ProfileLinkFormField({
  defaultValue
}: {
  defaultValue: DummyProfileLink;
}) {
  const urlForm = useFormBase({
    defaultValue: defaultValue.url,
    validators: [requiredValidator(), urlValidator()]
  });
  const labelForm = useFormBase({
    defaultValue: defaultValue.label,
    validators: [requiredValidator(), maxLengthValidator(10)]
  });
  return (
    <>
      <StringFormRow label="URL" form={urlForm}></StringFormRow>
      <StringFormRow label="ラベル" form={labelForm}></StringFormRow>
    </>
  );
}

type FormParent<T, E> = {
  defaultValue: T;
  onUpdate: (
    v: T | ((p: T) => T),
    s:
      | Record<string, E | null>
      | ((o: Record<string, E | null>) => Record<string, E | null>)
  ) => void;
};

const useFormParent = <T, E>({ defaultValue }: { defaultValue: T }) => {
  const [value, setValue] = useState(defaultValue);
  const [validationSummary, setValidationSummary] = useState<
    Record<string, E | null>
  >({});
  const invalid = Object.values(validationSummary).some(f => !!f);
  const handleUpdate: FormParent<T, E>["onUpdate"] = (v, s) => {
    setValue(v);
    setValidationSummary(s);
  };
  return {
    value,
    invalid,
    validationSummary,
    handleUpdate
  };
};

function ProfileFormField({
  parentForm
}: {
  parentForm: FormParent<DummyProfile, AppValidationErrorType>;
}) {
  const nameForm = useObjectKeyForm({
    key: "name",
    validators: [requiredValidator(), maxLengthValidator(10)],
    parentForm
  });
  const emailForm = useObjectKeyForm({
    key: "email",
    validators: [requiredValidator(), emailValidator()],
    parentForm
  });
  return (
    <>
      <StringFormRow label="名前" form={nameForm} />
      <StringFormRow label="メールアドレス" form={emailForm} />
      {/* <MockArrayFormRow
        label="リンク"
        form={profileLinkForm}
        Item={ProfileLinkFormField}
        calcItemProps={() => ({})}
      /> */}
    </>
  );
}

function DummyProfileForm({
  defaultValue,
  onSubmit,
  onCancel
}: { onSubmit: (v: DummyProfile) => void } & Pick<
  Parameters<typeof useFormNestRoot<DummyProfile, AppValidationErrorType>>[0],
  "defaultValue"
> &
  Pick<
    ComponentPropsWithoutRef<typeof MockFormFrame<DummyProfile>>,
    "onCancel"
  >) {
  const { value, invalid, validationSummary, handleUpdate } = useFormParent<
    DummyProfile,
    AppValidationErrorType
  >({
    defaultValue
  });

  return (
    <FormView
      invalid={invalid}
      onSubmit={() => onSubmit(value)}
      onCancel={onCancel}
    >
      <ProfileFormField
        parentForm={{
          defaultValue,
          onUpdate: handleUpdate
        }}
      />
      <div>{JSON.stringify(validationSummary)}</div>
    </FormView>
  );
}

export default DummyProfileForm;
