import createCache from "@emotion/cache";

/**
 * Emotion のキャッシュ。サーバー（_document で CSS を書き出す）とブラウザで同じ設定を使う。
 * key を揃えておくと、ブラウザはサーバーが書き出した <style data-emotion="css ..."> をそのまま引き継ぐ
 */
const createEmotionCache = () => {
  const cache = createCache({ key: "css" });
  cache.compat = true;
  return cache;
};

export default createEmotionCache;
