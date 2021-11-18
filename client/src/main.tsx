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

import { withModal } from './components/HOC/withModal'
const RoutesWithModal = withModal(Routes)


render(
  <React.StrictMode>
    <Provider store={store}>
      <RoutesWithModal />
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
