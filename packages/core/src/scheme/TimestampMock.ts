// NOTE: firebase/firestore の Timestampを意図してるが、型をサーバーに持っていけないのでぼかす
type TimestampMock = { toDate: () => Date };

export const parseTimestampMock = (src: unknown): TimestampMock | null =>
  src ? (src as TimestampMock) : null;

export default TimestampMock;
