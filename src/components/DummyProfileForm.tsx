import {
  type AppValidationErrorType,
  arrayLengthValidator,
  emailValidator,
  maxLengthValidator,
  requiredValidator,
  urlValidator
} from "~/local/form-validator";
import {
  type ParentFormNestInterface,
  useArrayFormNest,
  useFormNestRoot,
  useFormNestField
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
  parentForm: ParentFormNestInterface<DummyProfileLink, AppValidationErrorType>;
}) {
  const urlForm = useFormNestField({
    parentForm,
    key: "url",
    validators: [requiredValidator(), urlValidator()]
  });
  const labelForm = useFormNestField({
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
  parentForm: ParentFormNestInterface<DummyProfile, AppValidationErrorType>;
}) {
  const nameForm = useFormNestField({
    parentForm,
    key: "name",
    validators: [requiredValidator(), maxLengthValidator(10)]
  });
  const emailForm = useFormNestField({
    parentForm,
    key: "email",
    validators: [requiredValidator(), emailValidator()]
  });
  const profileLinkForm = useArrayFormNest({
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
}: {
  defaultValue: DummyProfile;
  onSubmit: (v: DummyProfile) => void;
  onCancel: () => void;
}) {
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
