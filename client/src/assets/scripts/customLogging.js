window._p = function customLog(message, objs, color = "black") {
  switch (color) {
    case "success":
      color = "Green";
      break;
    case "!":
      color = "pink";
      break;
    case "info":
      color = "Yellow";
      break;
    case "error":
      color = "Red";
      break;
    case "warning":
      color = "Orange";
      break;
    default:
      color = color;
  }
  if (!import.meta.env.PROD) {
    console.log(`%c${message}`, `color:${color}`);
    typeof objs == "object" && console.table(objs);
  }
};
import { debounce } from "app/helpers";
window.FlashMessage.warning = debounce(
  window.FlashMessage.warning.bind(window),
  700
);
