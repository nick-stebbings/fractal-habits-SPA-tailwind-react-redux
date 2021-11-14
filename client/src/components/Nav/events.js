const showMegaMenu = (id) => {
  document.querySelector(".mask-wrapper").style.height = "357px";
  const menus = [...document.querySelectorAll(".mega-menu")];
  menus.forEach((menu, idx) => {
    if (id === idx) {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
  });
  document.querySelector(".mask-wrapper").style.zIndex = "40";
  menus.every((menu) => menu.style.display === "none") &&
    (document.querySelector(".habit-description-label").style.opacity = "1");
};
const hideMegaMenu = () => {
  document.querySelector(".mask-wrapper").style.height = "5rem";
  [...document.querySelectorAll(".mega-menu")].forEach((menu) => {
    menu.style.display = "none";
  });
  document.querySelector(".habit-description-label").style.opacity = "0";
  document.querySelector(".mask-wrapper").style.zIndex = "10";
};
const checkAndUpdateCalendar = () => {
  if (false) {
    //HabitStore.current() && pendingCalendarRefresh()
    //  pendingCalendarRefresh(false);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  [...document.querySelectorAll(".nav li.hoverable")].forEach((navItem) => {
    navItem.addEventListener("click", (e) => {
      const { id } = e.target;
      if (
        document.body.classList.contains("scroll-down") ||
        document.body.classList.contains("scroll-up")
      ) {
        // Allow finding the top of the page again using active nav list item
        document.body.scroll(0, 0);
      }
      const links = ["nav-visualise", "nav-habits"];
      const idx = links.indexOf(id);
      const oppositeLink = document.querySelector(
        "li.hoverable #" + links[1 - idx]
      );
      navItem?.classList.add("active");
      oppositeLink?.parentNode.classList.remove("active");
      oppositeLink?.parentNode.classList.add("inactive");
      document.querySelector("#current-habit-label")?.classList.add("inactive");
      document
        .querySelector("#current-habit-label")
        ?.classList.remove("active");

      document.querySelector(".mask-wrapper").style.height === "5rem"
        ? showMegaMenu(idx)
        : hideMegaMenu();
    });
  });
  const calendarWidget = document.querySelector(".date-card-wrapper");
  const habitLabel = document.querySelector("#current-habit-label");

  habitLabel.addEventListener("click", (e) => {
    const menuVisible =
      document.querySelector(".mask-wrapper").style.height === "5rem";
    e.currentTarget.classList.toggle("active");
    [...document.querySelectorAll(".nav li.hoverable")].forEach((navItem) => {
      navItem.classList.remove("active");
    });
    menuVisible ? showMegaMenu() : hideMegaMenu();
  });

  calendarWidget.addEventListener("mouseenter", showMegaMenu);
  calendarWidget.addEventListener("mouseenter", checkAndUpdateCalendar);
  calendarWidget.addEventListener("mouseleave", hideMegaMenu);
  document.querySelector(".nav-container").addEventListener("click", (e) => {
    if (!e.target.classList.contains("nav-container")) return;
    showMegaMenu();
  });
  document
    .querySelector("nav.nav")
    .addEventListener("mouseenter", hideMegaMenu);
});
