import { useState, type ComponentPropsWithoutRef } from "react";
import {
  type AppValidationErrorType,
  emailValidator,
  maxLengthValidator,
  requiredValidator,
  urlValidator
} from "~/lib/form-validator";
import {
  useFormBase,
  useFormNestRoot,
  useObjectKeyForm
} from "~/lib/react/form-nest";
import type DummyProfile from "~/scheme/DummyProfile";
import { type DummyProfileLink } from "~/scheme/DummyProfile";
import {
  FormView,
  MockFormFrame,
  MockStringFormRow
} from "~/components/mock/mock-form-ui";

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
      <MockStringFormRow label="URL" form={urlForm}></MockStringFormRow>
      <MockStringFormRow label="ラベル" form={labelForm}></MockStringFormRow>
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
      <MockStringFormRow label="名前" form={nameForm} />
      <MockStringFormRow label="メールアドレス" form={emailForm} />
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
