import {
  parseNumber,
  parseObject,
  parseString
} from "@hinagata-next/core/common/parser-helper";

export type UserRecord = {
  createdAt: number;
  nickname: string;
};

export const parseUserRecord = (src: unknown): UserRecord =>
  parseObject<UserRecord>(src, ({ createdAt, nickname }) => ({
    createdAt: parseNumber(createdAt),
    nickname: parseString(nickname)
  }));
