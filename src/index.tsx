import React from "react";

import ReactDOM from "react-dom";

import App from "./components/App";
import { createGlobalStyle, css } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 15px;
    line-height: 20px;
    color: #333;
    background: #fafafa;
  }
  
  body {
    margin: 0;
  }
`;

const root = document.createElement("div");
document.body.appendChild(root);

function render() {
  ReactDOM.render(
    <>
      <GlobalStyle />
      <App />
    </>,
    root
  );
}

render();

if (module.hot) {
  module.hot.accept("./index.tsx", function() {
    console.log("Accepting the updated app module!");
    render();
  });
}
