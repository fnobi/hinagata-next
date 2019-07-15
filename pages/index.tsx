import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import DefaultLayout from "~/layouts/DefaultLayout";
import sampleStore from "~/store/sample";
import { connectToHooks } from "~/lib/sReduxHelper";

export default () => {
  const [count, setCount] = useState<number>(0);
  const sampleState = connectToHooks(sampleStore);
  const { mouse } = sampleState;

  const updateMouse = (e: React.MouseEvent) => {
    sampleStore.dispatch("setMouse", { x: e.pageX, y: e.pageY });
  };

  return (
    <DefaultLayout>
      <Wrapper onMouseMove={updateMouse}>
        <Title>Welcome to Next.js!</Title>
        <button type="button" onClick={() => setCount(count + 1)}>
          count up:{count}
        </button>
        <p>{mouse.join(",")}</p>
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
