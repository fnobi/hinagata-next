import {
  parseArray,
  parseObject,
  parseString
} from "@hinagata-next/core/common/parser-helper";
import type TimestampMock from "@hinagata-next/core/common/TimestampMock";
import { parseTimestampMock } from "@hinagata-next/core/common/TimestampMock";

export type DummyProfileLink = { label: string; url: string };

type DummyProfile = {
  name: string;
  email: string;
  profileLinks: DummyProfileLink[];
  createdAt: TimestampMock | null;
};

export const parseDummyProfileLink = (src: unknown) =>
  parseObject<DummyProfileLink>(src, ({ label, url }) => ({
    label: parseString(label),
    url: parseString(url)
  }));

export const parseDummyProfile = (src: unknown) =>
  parseObject<DummyProfile>(
    src,
    ({ name, email, profileLinks, createdAt }) => ({
      name: parseString(name),
      email: parseString(email),
      profileLinks: parseArray(profileLinks, parseDummyProfileLink),
      createdAt: parseTimestampMock(createdAt)
    })
  );

export default DummyProfile;
