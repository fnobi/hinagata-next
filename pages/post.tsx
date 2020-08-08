import React, { Component } from "react";
import { NextPageContext } from "next";
import { css } from "@emotion/core";
import DefaultLayout from "~/layouts/DefaultLayout";
import posts from "~/data/post";

type PostData = {
  title: string;
  body: string;
};

type PostProps = {
  postData: PostData;
};

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: 20,
  left: 0,
  width: "100%",
  height: "100%"
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: "0.5em"
});

export default class Post extends Component<PostProps> {
  public static getInitialProps(ctx: NextPageContext): PostProps {
    const { query } = ctx;
    const { postId } = query;
    const jsonPostData = posts[postId.toString()] || {};
    const { title = "", body = "" } = jsonPostData;
    return {
      postData: {
        title,
        body
      }
    };
  }

  public render() {
    const { postData } = this.props;
    const { title, body } = postData;
    return (
      <DefaultLayout>
        <div css={wrapperStyle}>
          <h2 css={titleStyle}>{title}</h2>
          <p>{body}</p>
        </div>
      </DefaultLayout>
    );
  }
}
