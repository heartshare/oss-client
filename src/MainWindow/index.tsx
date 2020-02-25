import React from "react";
import reactDom from "react-dom";
import { Provider } from "react-redux";
import { compose, createStore } from "redux";
import "normalize.css/normalize.css";

import App from "./App";
import { rootReducer } from "./store";
import "./index.scss";

const devTools: any =
  process.env.NODE_ENV === "development"
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : null;

const store = createStore(rootReducer, compose(devTools));

const rootElement = document.getElementById("root");
reactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

/**
 * TODO LIST
 * 1、在渲染进程中不使用 node；
 * 2、熟悉脚手架工具；
 * 3、mobx
 * 4、Immutable.js
 */
