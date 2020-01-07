import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import DefaultLayout from "~/layouts/DefaultLayout";
import sampleStore, { SampleState } from "~/store/sample";
import { connectStoreAll } from "~/lib/typeRegiHelper";
import { percent, px, em } from "~/lib/cssUtil";

type Props = {};

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: px(0),
  left: px(0),
  width: percent(100),
  height: percent(100)
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: em(0.5)
});

export default connectStoreAll(sampleStore, (props: Props & SampleState) => {
  const { count } = props;

  return (
    <DefaultLayout title="about">
      <div css={wrapperStyle}>
        <div css={titleStyle}>About</div>
        <button
          type="button"
          onClick={() => sampleStore.dispatch("incrementCounter", { value: 1 })}
        >
          count up:{count}
        </button>
        <p>
          <Link href="/">
            <a href="/">top</a>
          </Link>
        </p>
      </div>
    </DefaultLayout>
  );
});
