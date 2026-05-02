import {
  parseArray,
  parseObject,
  parseString
} from "~/common/lib/parser-helper";

export type DummyProfileLink = { label: string; url: string };

type DummyProfile = {
  name: string;
  email: string;
  profileLinks: DummyProfileLink[];
};

export const parseDummyProfileLink = (src: unknown) =>
  parseObject<DummyProfileLink>(src, ({ label, url }) => ({
    label: parseString(label),
    url: parseString(url)
  }));

export const parseDummyProfile = (src: unknown) =>
  parseObject<DummyProfile>(src, ({ name, email, profileLinks }) => ({
    name: parseString(name),
    email: parseString(email),
    profileLinks: parseArray(profileLinks, parseDummyProfileLink)
  }));

export default DummyProfile;
