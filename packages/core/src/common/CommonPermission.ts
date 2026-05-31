import { parseBoolean, parseObject } from "@hinagata-next/core/common/parser-helper";

type CommonPermission = { valid: boolean };

export const parseCommonPermission = (src: unknown) =>
  parseObject<CommonPermission>(src, ({ valid }) => ({
    valid: parseBoolean(valid)
  }));

export default CommonPermission;
