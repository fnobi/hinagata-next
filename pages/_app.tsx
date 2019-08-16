import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import createStore from "~/createStore";

const store = createStore();

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
