import React from "react";
import styled from "styled-components";
import Link from "next/link";
import DefaultLayout from "~/layouts/DefaultLayout";
import sampleStore from "~/store/sample";
import { connectToHooks } from "~/lib/typeRegiHelper";

export default () => {
  const sampleState = connectToHooks(sampleStore);
  const { count } = sampleState;

  return (
    <DefaultLayout>
      <Wrapper>
        <Title>About</Title>
        <button
          type="button"
          onClick={() => sampleStore.dispatch("incrementCounter", { value: 1 })}
        >
          count up:{count}
        </button>
        <p>
          <Link href="/">top</Link>
        </p>
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
