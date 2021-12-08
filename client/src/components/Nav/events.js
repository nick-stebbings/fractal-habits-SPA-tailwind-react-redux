import Hammer from "hammerjs";
import { isTouchDevice } from "app/helpers";

const addSwipeGestures = function () {
  const swipeBase = document.querySelector("#vis");
  const manager = new Hammer.Manager(swipeBase);
  const Swipe = new Hammer.Swipe();
  const nextDate = document.querySelector(".fa-chevron-circle-right");
  const prevDate = document.querySelector(".fa-chevron-circle-left");

  manager.add(Swipe);
  manager.on("swipe", (e) => {
    if (Math.abs(e.deltaX) > 500) {
      console.log("prevDate :>> ", prevDate);
      const dispEvent = new Event("click");
      e.deltaX > 0
        ? prevDate.dispatchEvent(dispEvent)
        : nextDate.dispatchEvent(dispEvent);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  isTouchDevice() && addSwipeGestures();
  // ResponsiveNav groups
  const navGroupsList = document
    .querySelector("ul.nav-groups")
    ?.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        // Collapse responsive menu when you click active link
        document.getElementById("hamburger").checked = false;
      }
    });

  // Date list
  const dateInputs = document.querySelectorAll(".date-today");
  document.addEventListener("input", (e) => {
    if (e.target.value.search(/\d\d-\d\d-\d\d/) === -1) return;

    // let currentSpace = selectCurrentSpace(store.getState())
    // let thisWeekSpaces = selectThisWeekSpaces(store.getState())
    // let dateIndex = thisWeekSpaces.findIndex(space => space.timeframe.fromDate == currentSpace.timeframe.fromDate)
    // let newDateIndex = dateIndex - 1;
    // if (newDateIndex >= 0) { thisWeekSpaces[newDateIndex] }
    // else {
    //   lastWeekSpace.slice(-1)[0];
    // };
  });
});
