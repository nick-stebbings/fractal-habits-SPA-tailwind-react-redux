import React from "react";
import { render } from "react-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { Routes } from "./routes/Routes";

// Import our CSS
import "./styles/bundle.css";

// Vendor CSS
import "./styles/vendor/flashJS/import";

// Vendor JS
import "./assets/scripts/vendor/flash.min.js";

// Misc JS
import "./app/mobSwipeEvents"
import "./assets/scripts/customLogging"

render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
