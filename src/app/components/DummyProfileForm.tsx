import { useMemo, useState } from "react";
import {
  MockArrayFormRow,
  type CommonFormFieldProps,
  MockFormFrame,
  MockStringFormRow
} from "~/common/components/mock-form-ui";
import {
  arrayLengthValidator,
  emailFormatValidator,
  requiredValidator,
  stringMaxLengthValidator,
  subArrayFieldValidator,
  urlFormatValidator
} from "~/common/lib/form-validator";
import FormOrganizer from "~/common/lib/FormOrganizer";
import {
  parseDummyProfileLink,
  type DummyProfileLink
} from "~/app/scheme/DummyProfile";
import type DummyProfile from "~/app/scheme/DummyProfile";

const dummyProfileLinkFormOrganizer = new FormOrganizer<DummyProfileLink>()
  .fieldValidator("url", requiredValidator())
  .fieldValidator("url", urlFormatValidator())
  .fieldValidator("label", stringMaxLengthValidator(10));

const dummyProfileFormOrganizer = new FormOrganizer<DummyProfile>()
  .fieldValidator("name", requiredValidator())
  .fieldValidator("name", stringMaxLengthValidator(10))
  .fieldValidator("email", requiredValidator())
  .fieldValidator("email", emailFormatValidator())
  .fieldValidator("profileLinks", arrayLengthValidator(0, 3))
  .fieldValidator(
    "profileLinks",
    subArrayFieldValidator(dummyProfileLinkFormOrganizer)
  );

const ProfileLinkFormField = ({
  value,
  onChange
}: CommonFormFieldProps<DummyProfileLink>) => {
  const errors = useMemo(
    () => dummyProfileLinkFormOrganizer.getErrors(value),
    [value]
  );
  return (
    <>
      <MockStringFormRow
        label="URL"
        value={value.url}
        onChange={v => onChange({ ...value, url: v })}
        error={errors.url}
      />
      <MockStringFormRow
        label="ラベル"
        value={value.label}
        onChange={v => onChange({ ...value, label: v })}
        error={errors.label}
      />
    </>
  );
};

const ProfileFormField = ({
  value,
  onChange
}: CommonFormFieldProps<DummyProfile>) => {
  const errors = useMemo(
    () => dummyProfileFormOrganizer.getErrors(value),
    [value]
  );
  return (
    <>
      <MockStringFormRow
        label="名前"
        autoComplete="name"
        value={value.name}
        onChange={v => onChange({ ...value, name: v })}
        error={errors.name}
        maxLength={dummyProfileFormOrganizer.maxLengthes.name}
      />
      <MockStringFormRow
        label="メールアドレス"
        autoComplete="email"
        value={value.email}
        onChange={v => onChange({ ...value, email: v })}
        error={errors.email}
      />
      <MockArrayFormRow
        label="リンク"
        value={value.profileLinks}
        onChange={v => onChange({ ...value, profileLinks: v })}
        error={errors.profileLinks}
        makeNew={parseDummyProfileLink}
        Item={ProfileLinkFormField}
      />
    </>
  );
};

const DummyProfileForm = ({
  defaultValue,
  onSubmit,
  onCancel
}: {
  defaultValue: DummyProfile;
  onSubmit: (v: DummyProfile) => void;
  onCancel: () => void;
}) => {
  const [profile, setProfile] = useState(defaultValue);
  const { validValue } = useMemo(
    () => dummyProfileFormOrganizer.getValidValue(profile),
    [profile]
  );
  return (
    <MockFormFrame
      validValue={validValue}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <ProfileFormField value={profile} onChange={setProfile} />
    </MockFormFrame>
  );
};

export default DummyProfileForm;
