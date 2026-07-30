import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { type ReactNode, useState } from "react";

const EmotionProvider = ({ children }: { children: ReactNode }) => {
  const [cache] = useState(() => {
    const c = createCache({ key: "css" });
    c.compat = true;
    return c;
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default EmotionProvider;
