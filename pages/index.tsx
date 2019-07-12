import { useState } from "react";

export default () => {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      Welcome to Next.js!<br />
      <button onClick={() => setCount(count + 1)}>count up: {count}</button>
    </div>
  );
};