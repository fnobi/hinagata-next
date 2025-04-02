import { type ComponentPropsWithoutRef } from "react";
import {
  emaiValidator,
  maxLengthValidator,
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
  AdminArrayFormUnit,
  AdminFormLayout,
  AdminStringFormRow
} from "~/components/mock/mock-form-ui";

const NAME_MAX_LENGTH = 10;

function ProfileLinkFormField({
  form
}: {
  form: FormNestParentInterface<DummyProfileLink>;
}) {
  const urlForm = useObjectKeyForm({
    parent: form,
    key: "url",
    validator: {
      required: true,
      getError: v => urlValidator(v)
    }
  });
  const labelForm = useObjectKeyForm({
    parent: form,
    key: "label",
    validator: {
      required: false
    }
  });

  return (
    <div>
      <AdminStringFormRow label="URL" form={urlForm} />
      <AdminStringFormRow label="ラベル" form={labelForm} />
    </div>
  );
}

function ProfileFormField({
  parentForm
}: {
  parentForm: FormNestParentInterface<DummyProfile>;
}) {
  const nameForm = useObjectKeyForm({
    parent: parentForm,
    key: "name",
    validator: {
      required: true,
      getError: v => maxLengthValidator(v, NAME_MAX_LENGTH)
    }
  });
  const emailForm = useObjectKeyForm({
    parent: parentForm,
    key: "email",
    validator: {
      required: true,
      getError: v => emaiValidator(v)
    }
  });
  const profileLinkForm = useArrayNest({
    parent: parentForm,
    key: "profileLinks",
    maxLength: 3,
    makeNew: () => ({ url: "", label: "" }),
    pull: p => p.profileLinks,
    push: (v, p) => ({ ...p, profileLinks: v })
  });

  return (
    <>
      <AdminStringFormRow
        label="名前"
        form={nameForm}
        counter={{ maxLength: NAME_MAX_LENGTH }}
        autoComplete="name"
      />
      <AdminStringFormRow
        label="メールアドレス"
        form={emailForm}
        autoComplete="email"
      />
      <AdminArrayFormUnit
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
}: Pick<Parameters<typeof useFormNestRoot<DummyProfile>>[0], "defaultValue"> &
  Pick<
    ComponentPropsWithoutRef<typeof AdminFormLayout<DummyProfile>>,
    "onCancel" | "onSubmit"
  >) {
  const form = useFormNestRoot<DummyProfile>({
    defaultValue
  });
  return (
    <AdminFormLayout form={form} onSubmit={onSubmit} onCancel={onCancel}>
      <ProfileFormField parentForm={form} />
    </AdminFormLayout>
  );
}

export default DummyProfileForm;
