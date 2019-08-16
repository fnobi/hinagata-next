import { applyMiddleware, createStore, Middleware } from "redux";
import reduxLogger from "redux-logger";
import reduxThunk from "redux-thunk";
import reducers from "~/reducers";

export default () => {
  const middlewares: Middleware[] = [reduxThunk];

  if (process.env.NODE_ENV !== "production") {
    middlewares.push(reduxLogger);
  }

  return createStore(reducers, applyMiddleware(...middlewares));
};
