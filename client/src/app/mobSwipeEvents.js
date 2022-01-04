// Customer error messages for dev

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

// Mobile swipe events

import Hammer from "hammerjs";
import { isTouchDevice } from "app/helpers";

export const Swipe = new Hammer.Swipe();

const addSwipeGestures = function () {
  const swipeBase = document.querySelector("#app");
  const manager = new Hammer.Manager(swipeBase);
  const nextDate = document.querySelector(".fa-chevron-circle-right");
  const prevDate = document.querySelector(".fa-chevron-circle-left");

  manager.add(Swipe);
  manager.on("swipe", (e) => {
    if (Math.abs(e.deltaX) > 500) {
      e.srcEvent.preventDefault();
      e.deltaX > 0 ? prevDate.click() : nextDate.click();
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  isTouchDevice() && addSwipeGestures();
});
