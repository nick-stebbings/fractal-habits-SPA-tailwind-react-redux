window._p = function customLog(message, objs, color='black') {
     switch (color) {
         case 'success':  
              color = 'Green'
              break
         case '!':     
                 color = 'pink'  
              break;
         case 'info':     
                 color = 'Yellow'  
              break;
         case 'error':   
              color = 'Red'   
              break;
         case 'warning':  
              color = 'Orange' 
              break;
         default: 
              color = color
     }

  console.log(`%c${message}`, `color:${color}`)
  typeof objs == 'object' && console.table(objs);
}
import { debounce } from "app/helpers";
window.FlashMessage.warning = debounce(window.FlashMessage.warning.bind(window), 700)


import React from "react";
import { render } from "react-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { Routes } from "./routes/Routes";

// Import our CSS
import "./styles/bundled-styles.css"; 
import "./styles/bundled-styles.css"; 
// import "./assets/styles/app-base.pcss";
// import "./assets/styles/app-utils.pcss";
// import "./assets/styles/app-components.pcss";
import "./assets/styles/vendor/flashJS/import";

// Vendor JS
import "./assets/scripts/vendor/flash.min.js";

render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
