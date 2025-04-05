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
  type FormNestParentInterface,
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
  form
}: {
  form: FormNestParentInterface<DummyProfileLink, AppValidationErrorType>;
}) {
  const urlForm = useObjectKeyForm({
    parent: form,
    key: "url",
    validator: [requiredValidator(), urlValidator()]
  });
  const labelForm = useObjectKeyForm({
    parent: form,
    key: "label",
    validator: [maxLengthValidator(10)]
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
  parentForm: FormNestParentInterface<DummyProfile, AppValidationErrorType>;
}) {
  const nameForm = useObjectKeyForm({
    parent: parentForm,
    key: "name",
    validator: [requiredValidator(), maxLengthValidator(10)]
  });
  const emailForm = useObjectKeyForm({
    parent: parentForm,
    key: "email",
    validator: [requiredValidator(), emailValidator()]
  });
  const profileLinkForm = useArrayNest({
    parent: parentForm,
    key: "profileLinks",
    validator: [arrayLengthValidator({ maxLength: 3 })],
    makeNew: () => ({ url: "", label: "" }),
    pull: p => p.profileLinks,
    push: (v, p) => ({ ...p, profileLinks: v })
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
}: Pick<
  Parameters<typeof useFormNestRoot<DummyProfile, AppValidationErrorType>>[0],
  "defaultValue"
> &
  Pick<
    ComponentPropsWithoutRef<typeof MockFormFrame<DummyProfile>>,
    "onCancel" | "onSubmit"
  >) {
  const form = useFormNestRoot<DummyProfile, AppValidationErrorType>({
    defaultValue
  });
  return (
    <MockFormFrame form={form} onSubmit={onSubmit} onCancel={onCancel}>
      <ProfileFormField parentForm={form} />
    </MockFormFrame>
  );
}

export default DummyProfileForm;
