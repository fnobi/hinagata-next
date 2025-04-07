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
import { MockFormFrame } from "~/components/mock/mock-form-ui";

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

function ProfileFormField({
  defaultValue,
  onUpdate
}: {
  defaultValue: DummyProfile;
  onUpdate: (
    v: DummyProfile | ((p: DummyProfile) => DummyProfile),
    s:
      | Record<string, AppValidationErrorType | null>
      | ((
          o: Record<string, AppValidationErrorType | null>
        ) => Record<string, AppValidationErrorType | null>)
  ) => void;
}) {
  const nameForm = useFormBase({
    defaultValue: defaultValue.name,
    validators: [requiredValidator(), maxLengthValidator(10)],
    onUpdate: (v, r) => {
      const currentError = r.find(rr => rr.errorMessage);
      onUpdate(
        p => ({ ...p, name: v }),
        o => ({
          ...o,
          name: currentError ? currentError.param : null
        })
      );
    }
  });
  const emailForm = useFormBase({
    defaultValue: defaultValue.email,
    validators: [requiredValidator(), emailValidator()],
    onUpdate: (v, r) => {
      const currentError = r.find(rr => rr.errorMessage);
      onUpdate(
        p => ({ ...p, email: v }),
        o => ({
          ...o,
          email: currentError ? currentError.param : null
        })
      );
    }
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
}: Pick<
  Parameters<typeof useFormNestRoot<DummyProfile, AppValidationErrorType>>[0],
  "defaultValue"
> &
  Pick<
    ComponentPropsWithoutRef<typeof MockFormFrame<DummyProfile>>,
    "onCancel" | "onSubmit"
  >) {
  const [profile, setProfile] = useState(defaultValue);
  const [validationSummary, setValidationSummary] = useState<
    Record<string, AppValidationErrorType | null>
  >({});

  return (
    <MockFormFrame
      value={profile}
      invalid={Object.values(validationSummary).some(f => !!f)}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <ProfileFormField
        defaultValue={defaultValue}
        onUpdate={(fn1, fn2) => {
          setProfile(fn1);
          setValidationSummary(fn2);
        }}
      />
      <div>{JSON.stringify(validationSummary)}</div>
    </MockFormFrame>
  );
}

export default DummyProfileForm;
