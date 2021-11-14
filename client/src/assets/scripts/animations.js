import Hammer from "hammerjs";
import { debounce } from "./d3-utilities";
import { isTouchDevice } from "./utilities";
import HabitStore from "../../store/habit-store";
import HabitDateStore from "../../store/habit-date-store";
import DomainStore from "../../store/domain-store";
const openSpinner = function (open = true) {
  const modalOverlay = document.querySelector("#modal_overlay");
  open
    ? modalOverlay?.classList.remove("hidden")
    : modalOverlay?.classList.add("hidden");
};

const openModal = function (open = true) {
  const modalOverlay = document.querySelector("#modal_overlay");
  if (!modalOverlay) return;
  const modal = modalOverlay.querySelector("#modal");
  const modalCl = modal?.classList;
  if (!modalCl) return;
  if (open) {
    modalOverlay?.classList.remove("hidden");
    [...document.querySelectorAll('div[id^="tippy"]')].forEach((tooltip) => {
      tooltip?.classList.add("hidden");
    });
    setTimeout(() => {
      modalCl.remove("opacity-0");
      modalCl.remove("-translate-y-full");
      modalCl.remove("scale-150");
      modal.style["z-index"] = 101;
      document.documentElement.style.overflow = "hidden";
    }, 100);
  } else {
    modalCl.add("-translate-y-full");
    setTimeout(() => {
      modalCl.add("opacity-0");
      modalCl.add("scale-150");
      modal.style["z-index"] = -101;
      document.documentElement.style.overflow = "initial";
    }, 100);
    setTimeout(() => modalOverlay.classList.add("hidden"), 300);
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

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

const registerEventListeners = (function () {
  const { body } = document;
  document.addEventListener("DOMContentLoaded", () => {
    const hamburgerCheckbox = document.getElementById("hamburger");
    const respNavLabel = document.getElementById("hamburger-label");
    respNavLabel &&
      respNavLabel.addEventListener("focus", (e) => {
        // Todo: add this and the logo as 'keyboard pressable' events for accessibility
        hamburgerCheckbox.checked = !hamburgerCheckbox.checked;
      });

    const modalElement = document.getElementById("modal_overlay");
    modalElement &&
      modalElement.addEventListener("click", (e) => {
        if (e.target.id.includes("close-modal")) {
          openModal(false);
        }
      });
    document.body.addEventListener("scroll", debounce(handleScroll, 500));

    const removeBodyScrollClass = () => body.setAttribute("class", "");
    const scrollUp = "scroll-up";
    const scrollDown = "scroll-down";
    let lastScroll = 0;
    function handleScroll() {
      const currentScroll = body.scrollTop;
      if (currentScroll < 5) return removeBodyScrollClass();
      if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        // down
        body.classList.remove(scrollUp);
        body.classList.add(scrollDown);
      } else if (
        currentScroll <= lastScroll &&
        body.classList.contains(scrollDown)
      ) {
        // up
        body.classList.remove(scrollDown);
        body.classList.add(scrollUp);
      }
      lastScroll = currentScroll;
    }
  });
})();

export {
  registerEventListeners,
  openModal,
  openSpinner,
  addSwipeGestures,
  addIntersectionObserver,
  addTooltips,
};
