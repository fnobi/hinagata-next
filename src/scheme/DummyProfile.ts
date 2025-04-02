export type DummyProfileLink = { label: string; url: string };

type DummyProfile = {
  name: string;
  email: string;
  profileLinks: DummyProfileLink[];
};

export default DummyProfile;
