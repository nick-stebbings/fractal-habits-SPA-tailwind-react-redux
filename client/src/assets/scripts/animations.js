import Hammer from "hammerjs";
import { debounce } from "./d3-utilities";
import { isTouchDevice } from "./utilities";

const addSwipeGestures = function () {
  const swipeBase = document.querySelector("main");
  const manager = new Hammer.Manager(swipeBase);
  const Swipe = new Hammer.Swipe();
  const nextDate = document.getElementById("next-date-selector");
  const prevDate = document.getElementById("prev-date-selector");

  manager.add(Swipe);
  manager.on("swipe", (e) => {
    if (Math.abs(e.deltaX) > 500) {
      const dispEvent = new Event("click");
      e.deltaX > 0
        ? prevDate.dispatchEvent(dispEvent)
        : nextDate.dispatchEvent(dispEvent);
    }
  });
};

const addIntersectionObserver = function () {
  const options = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px",
  };

  const observerForPageFooter = new IntersectionObserver((entries) => {
    const controls = document.querySelector(".controlsSvg");
    const legend = document.querySelector(".legendSvg");
    const buttonGroup = document.querySelector(
      "#create-new-habit-child .button-group"
    );
    const habitInput = document.querySelector(
      ".sub-section-container:last-of-type"
    );
    if (!entries[0].isIntersecting) {
      buttonGroup && (buttonGroup.style.opacity = 1);
      habitInput && (habitInput.style.opacity = 1);
      return;
    }
    if (legend) {
      legend.style.opacity = legend.style.opacity === 0 ? 1 : 0;
    }
    if (controls) {
      controls.style.opacity = controls.style.opacity === 0 ? 1 : 0;
    }
    if (buttonGroup) {
      buttonGroup.style.opacity = buttonGroup.style.opacity === 0 ? 1 : 0;
    }
    if (habitInput) {
      habitInput.style.opacity = habitInput.style.opacity === 0 ? 1 : 0;
    }
  }, options);

  const pageFooter = document.querySelector("footer");
  observerForPageFooter && observerForPageFooter.observe(pageFooter);
};

const addTooltips = function () {
  if (m.route.param("demo") || DomainStore.list().length > 1) return;
  if (HabitStore.list().length === 0) {
    if (HabitStore.current().name !== "Select a Life-Domain to start tracking")
      return;
    // First time user interaction tooltips:
    // First page load
    let modalIsVisible =
      document.getElementById("modal_overlay") &&
      document.getElementById("modal_overlay").classList.contains("hidden");
    setTimeout(() => {
      if (HabitDateStore.list().length > 0 || modalIsVisible) return;
      tippy(".nav-pill:nth-of-type(1)", {
        content: "This is an example of a life area you might want to track",
        showOnCreate: true,
        inertia: true,
        maxWidth: 150,
      });
    }, 7500);
    setTimeout(() => {
      if (HabitDateStore.list().length > 0 || modalIsVisible) return;
      tippy(".nav-pill:nth-of-type(2)", {
        content: "This DEMO of the app only offers a few areas to choose...",
        showOnCreate: true,
        inertia: true,
        maxWidth: 150,
      });
    }, 12500);
    setTimeout(() => {
      if (HabitDateStore.list().length > 0 || modalIsVisible) return;
      tippy(".nav-pill:nth-of-type(3)", {
        content: "...so pick an area to start adding habits!",
        showOnCreate: true,
        inertia: true,
        maxWidth: 150,
      });
    }, 17500);
  } else if (HabitStore.list().length === 1) {
    if (
      HabitStore.current().name == "Select a Life-Domain to start tracking" ||
      m.route.get() !== "/"
    )
      return;
    // After first habit creation
    setTimeout(() => {
      tippy(".nav-label-primary .domain-selector", {
        content:
          "Once you have added several life-domains, switch between them here.",
        showOnCreate: true,
        hideOnClick: true,
        inertia: true,
        maxWidth: 150,
        offset: isTouchDevice() ? [10, 275] : [0, 0],
        placement: isTouchDevice() ? "right-end" : "bottom",
      });
    }, 3500);
    if (isTouchDevice()) {
      setTimeout(() => {
        tippy(".sm-selector-container .domain-selector", {
          content:
            "You can select date here, but also swipe left/right on any screen to move in time",
          showOnCreate: true,
          hideOnClick: true,
          inertia: true,
          maxWidth: 150,
          offset: isTouchDevice() ? [25, 40] : [0, 0],
          placement: "bottom",
        });
      }, 7500);
    } else {
      setTimeout(() => {
        tippy("span#nav-visualise", {
          content:
            "Once you have added more habits, explore ways of visualising the hierarchy",
          showOnCreate: true,
          hideOnClick: true,
          inertia: true,
          maxWidth: 150,
        });
      }, 14500);
      setTimeout(() => {
        tippy("span#nav-habits", {
          content: "When you want to divide/build up habits, use this menu",
          showOnCreate: true,
          hideOnClick: true,
          inertia: true,
          maxWidth: 150,
          offset: [-30, 2],
        });
      }, 20500);
      setTimeout(() => {
        tippy("#prev-date-selector + fieldset #date-today", {
          content: "You can change the current tracked date here.",
          showOnCreate: true,
          hideOnClick: true,
          inertia: true,
          maxWidth: 150,
        });
      }, 7500);
    }
  }
};

export { addSwipeGestures, addIntersectionObserver, addTooltips };
