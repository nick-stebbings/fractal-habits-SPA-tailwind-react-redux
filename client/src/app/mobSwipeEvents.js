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
    if (Math.abs(e.deltaX) > 400) {
      e.srcEvent.preventDefault();
      e.deltaX > 0 ? prevDate.click() : nextDate.click();
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  isTouchDevice() && addSwipeGestures();
});
