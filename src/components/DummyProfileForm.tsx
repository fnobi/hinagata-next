import { useMemo, useState } from "react";
import FormOrganizer from "~/lib/FormOrganizer";
import type DummyProfile from "~/scheme/DummyProfile";
import {
  parseDummyProfileLink,
  type DummyProfileLink
} from "~/scheme/DummyProfile";
import {
  MockArrayFormRow,
  type CommonFormFieldProps,
  MockFormFrame,
  MockStringFormRow
} from "~/components/mock/mock-form-ui";

const dummyProfileLinkFormOrganizer = new FormOrganizer<DummyProfileLink>()
  .validator("url", { type: "required" })
  .validator("url", { type: "url-format" })
  .validator("label", { type: "string-max-length", maxLength: 10 });

const dummyProfileFormOrganizer = new FormOrganizer<DummyProfile>()
  .validator("name", { type: "required" })
  .validator("name", { type: "string-max-length", maxLength: 10 })
  .validator("email", { type: "required" })
  .validator("email", { type: "email-format" })
  .validator("profileLinks", {
    type: "array-length",
    minLength: 0,
    maxLength: 3
  })
  .customValidator("profileLinks", { type: "required" }, ({ profileLinks }) =>
    profileLinks.every(
      v => dummyProfileLinkFormOrganizer.getValidValue(v).validValue
    )
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
