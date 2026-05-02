import { parseBoolean, parseObject } from "~/common/lib/parser-helper";

type CommonPermission = { valid: boolean };

export const parseCommonPermission = (src: unknown) =>
  parseObject<CommonPermission>(src, ({ valid }) => ({
    valid: parseBoolean(valid)
  }));

export default CommonPermission;
