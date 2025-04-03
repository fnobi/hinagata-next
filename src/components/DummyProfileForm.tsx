import { type ComponentPropsWithoutRef } from "react";
import {
  EmailValidator,
  MaxLengthValidator,
  RequiredValidator,
  UrlValidator,
  ValidationErrorType
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

const MAX_LINK_LENGTH = 3;

function ProfileLinkFormField({
  form
}: {
  form: FormNestParentInterface<DummyProfileLink, ValidationErrorType>;
}) {
  const urlForm = useObjectKeyForm({
    parent: form,
    key: "url",
    validator: [new RequiredValidator(), new UrlValidator()]
  });
  const labelForm = useObjectKeyForm({
    parent: form,
    key: "label",
    validator: [new RequiredValidator(), new MaxLengthValidator(5)]
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
  parentForm: FormNestParentInterface<DummyProfile, ValidationErrorType>;
}) {
  const nameForm = useObjectKeyForm({
    parent: parentForm,
    key: "name",
    // TODO: validatorをdepsにいれたら死んじゃうのが怖い
    validator: [new RequiredValidator(), new MaxLengthValidator(10)]
  });
  const emailForm = useObjectKeyForm({
    parent: parentForm,
    key: "email",
    validator: [new RequiredValidator(), new EmailValidator()]
  });
  const profileLinkForm = useArrayNest<
    DummyProfileLink,
    DummyProfile,
    ValidationErrorType
  >({
    parent: parentForm,
    key: "profileLinks",
    maxLength: MAX_LINK_LENGTH,
    makeLengthError: () => ({
      type: "bad-array-length",
      message: `要素数が不正です。${MAX_LINK_LENGTH}個以下で設定してください。`
    }),
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
  Parameters<typeof useFormNestRoot<DummyProfile, ValidationErrorType>>[0],
  "defaultValue"
> &
  Pick<
    ComponentPropsWithoutRef<typeof MockFormFrame<DummyProfile>>,
    "onCancel" | "onSubmit"
  >) {
  const form = useFormNestRoot<DummyProfile, ValidationErrorType>({
    defaultValue
  });
  return (
    <MockFormFrame form={form} onSubmit={onSubmit} onCancel={onCancel}>
      <ProfileFormField parentForm={form} />
    </MockFormFrame>
  );
}

export default DummyProfileForm;
