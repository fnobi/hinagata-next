import React from "react";
import { useState } from "react";
import styled from "styled-components";
import DefaultLayout from "~/layouts/DefaultLayout";

export default () => {
  const [count, setCount] = useState<number>(0);
  return (
    <DefaultLayout>
      <Wrapper>
        <Title>Welcome to Next.js!</Title>
        <button type="button" onClick={() => setCount(count + 1)}>
          count up:{count}
        </button>
      </Wrapper>
    </DefaultLayout>
  );
};

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 0.5em;
`;
