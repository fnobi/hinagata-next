import { type EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { type ReactNode, useState } from "react";
import createEmotionCache from "~/common/emotion-cache";

/**
 * Emotion のキャッシュを配る。サーバーで描画するときは _document から cache を受け取り、
 * そこに溜まった CSS を HTML に書き出す（読み込み直後にスタイルが当たらない瞬間を作らない）
 */
const EmotionProvider = ({
  cache,
  children
}: {
  cache?: EmotionCache;
  children: ReactNode;
}) => {
  const [clientCache] = useState(() => cache ?? createEmotionCache());
  return <CacheProvider value={clientCache}>{children}</CacheProvider>;
};

export default EmotionProvider;
