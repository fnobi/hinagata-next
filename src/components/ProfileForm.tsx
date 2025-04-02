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
import {
  AdminArrayFormUnit,
  AdminFormLayout,
  AdminStringFormRow
} from "~/components/mock/mock-form-ui";

type ProfileLink = { label: string; url: string };

type MockData = {
  name: string;
  email: string;
  profileLinks: ProfileLink[];
};

const NAME_MAX_LENGTH = 10;

function ProfileLinkForm({
  form
}: {
  form: FormNestParentInterface<ProfileLink>;
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

function ProfileForm({ onCancel }: { onCancel: () => void }) {
  const formRoot = useFormNestRoot<MockData>({
    defaultValue: { name: "", email: "", profileLinks: [] }
  });
  const nameForm = useObjectKeyForm({
    parent: formRoot,
    key: "name",
    validator: {
      required: true,
      getError: v => maxLengthValidator(v, NAME_MAX_LENGTH)
    }
  });
  const emailForm = useObjectKeyForm({
    parent: formRoot,
    key: "email",
    validator: {
      required: true,
      getError: v => emaiValidator(v)
    }
  });
  const profileLinkForm = useArrayNest({
    parent: formRoot,
    key: "profileLinks",
    maxLength: 3,
    makeNew: () => ({ url: "", label: "" }),
    pull: p => p.profileLinks,
    push: (v, p) => ({ ...p, profileLinks: v })
  });
  return (
    <AdminFormLayout
      form={formRoot}
      onSubmit={v => {
        // eslint-disable-next-line no-console
        console.log("submit", v);
      }}
      onCancel={onCancel}
    >
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
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...profileLinkForm}
        label="リンク"
        Item={ProfileLinkForm}
        calcItemProps={() => ({})}
      />
    </AdminFormLayout>
  );
}

export default ProfileForm;
