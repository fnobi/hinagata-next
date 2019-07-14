import React from "react";
import { useState } from "react";
import DefaultLayout from "~/layouts/DefaultLayout";

export default () => {
  const [count, setCount] = useState<number>(0);
  return (
    <DefaultLayout>
      Welcome to Next.js!
      <br />
      <button type="button" onClick={() => setCount(count + 1)}>
        count up:{count}
      </button>
    </DefaultLayout>
  );
};
