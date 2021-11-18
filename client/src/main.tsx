import React from "react";
import { render } from "react-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { Routes } from "./routes/Routes";

// Import our CSS
// import "./assets/styles/app-components.pcss";
// import "./assets/styles/vendor/flashJS/import";

// Vendor JS
import "./assets/scripts/vendor/flash.min.js";
import "./styles/styles.css";
import "./styles/bundled-styles.css";
import "./assets/styles/app-base.pcss";
import "./assets/styles/app-components.pcss";
import "./assets/styles/app-utils.pcss";
let a = {
  d: 1,f:3 
}

render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
