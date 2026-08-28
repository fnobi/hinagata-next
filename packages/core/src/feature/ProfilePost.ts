import {
  parseObject,
  parseString
} from "@hinagata-next/core/common/parser-helper";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import { parseDummyProfile } from "@hinagata-next/core/feature/DummyProfile";
import type TimestampMock from "@hinagata-next/core/common/TimestampMock";
import { parseTimestampMock } from "@hinagata-next/core/common/TimestampMock";

type ProfilePost = {
  userId: string;
  profile: DummyProfile;
  createdAt: TimestampMock | null;
};

export const parseProfilePost = (src: unknown) =>
  parseObject<ProfilePost>(src, ({ userId, profile, createdAt }) => ({
    userId: parseString(userId),
    profile: parseDummyProfile(profile),
    createdAt: parseTimestampMock(createdAt)
  }));

export default ProfilePost;
