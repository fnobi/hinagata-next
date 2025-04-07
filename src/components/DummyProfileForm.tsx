import { type ComponentPropsWithoutRef } from "react";
import {
  type AppValidationErrorType,
  emailValidator,
  maxLengthValidator,
  requiredValidator,
  urlValidator
} from "~/lib/form-validator";
import {
  FormParent,
  useFormBase,
  useFormNestRoot,
  useObjectKeyForm
} from "~/lib/react/form-nest";
import type DummyProfile from "~/scheme/DummyProfile";
import { type DummyProfileLink } from "~/scheme/DummyProfile";
import {
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
      <MockStringFormRow label="名前" form={nameForm} autoComplete="name" />
      <MockStringFormRow
        label="メールアドレス"
        form={emailForm}
        autoComplete="email"
      />
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
  const { value, validationSummary, parentForm } = useFormNestRoot<
    DummyProfile,
    AppValidationErrorType
  >({
    defaultValue
  });

  return (
    <MockFormFrame
      validationSummary={validationSummary}
      onSubmit={() => onSubmit(value)}
      onCancel={onCancel}
    >
      <ProfileFormField parentForm={parentForm} />
    </MockFormFrame>
  );
}

export default DummyProfileForm;
