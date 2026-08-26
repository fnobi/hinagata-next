import { formatTimestampForFilename } from "~/common/format-timestamp";

describe("format-timestamp", () => {
  it("formats as YYYYMMDD-HHmmss with zero padding", () => {
    expect(formatTimestampForFilename(new Date(2026, 0, 5, 3, 7, 9))).toBe(
      "20260105-030709"
    );
    expect(formatTimestampForFilename(new Date(2026, 11, 31, 23, 59, 59))).toBe(
      "20261231-235959"
    );
  });
});
