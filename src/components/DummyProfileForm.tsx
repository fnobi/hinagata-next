import { type ComponentPropsWithoutRef } from "react";
import {
  type AppValidationErrorType,
  arrayLengthValidator,
  emailValidator,
  maxLengthValidator,
  requiredValidator,
  urlValidator
} from "~/lib/form-validator";
import {
  type FormParent,
  useArrayNest,
  useFormNestRoot,
  useObjectKeyForm
} from "~/lib/react/form-nest";
import type DummyProfile from "~/scheme/DummyProfile";
import { type DummyProfileLink } from "~/scheme/DummyProfile";
import {
  MockArrayFormRow,
  MockFormFrame,
  MockStringFormRow
} from "~/components/mock/mock-form-ui";

function ProfileLinkFormField({
  parentForm
}: {
  parentForm: FormParent<DummyProfileLink, AppValidationErrorType>;
}) {
  const urlForm = useObjectKeyForm({
    parentForm,
    key: "url",
    validators: [requiredValidator(), urlValidator()]
  });
  const labelForm = useObjectKeyForm({
    parentForm,
    key: "label",
    validators: [maxLengthValidator(10)]
  });
  return (
    <>
      <MockStringFormRow label="URL" form={urlForm} />
      <MockStringFormRow label="ラベル" form={labelForm} />
    </>
  );
}

function ProfileFormField({
  parentForm
}: {
  parentForm: FormParent<DummyProfile, AppValidationErrorType>;
}) {
  const nameForm = useObjectKeyForm({
    parentForm,
    key: "name",
    validators: [requiredValidator(), maxLengthValidator(10)]
  });
  const emailForm = useObjectKeyForm({
    parentForm,
    key: "email",
    validators: [requiredValidator(), emailValidator()]
  });
  const profileLinkForm = useArrayNest<
    DummyProfileLink,
    DummyProfile,
    AppValidationErrorType
  >({
    parentForm,
    pull: p => p.profileLinks,
    push: (v, p) => ({ ...p, profileLinks: v }),
    makeNew: () => ({ label: "", url: "" }),
    errorKey: "profileLinks",
    validators: [arrayLengthValidator({ maxLength: 3 })]
  });
  return (
    <>
      <MockStringFormRow label="名前" form={nameForm} autoComplete="name" />
      <MockStringFormRow
        label="メールアドレス"
        form={emailForm}
        autoComplete="email"
      />
      <MockArrayFormRow
        label="リンク"
        form={profileLinkForm}
        Item={ProfileLinkFormField}
        calcItemProps={() => ({})}
      />
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
  Pick<ComponentPropsWithoutRef<typeof MockFormFrame>, "onCancel">) {
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
