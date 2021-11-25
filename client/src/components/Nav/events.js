document.addEventListener("DOMContentLoaded", () => {
  // ResponsiveNav groups
  const navGroupsList = document
    .querySelector("ul.nav-groups")
    .addEventListener("click", (e) => {
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

  // Menu links
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
      document.querySelector("#current-habit-label")?.classList.add("inactive");
      document
        .querySelector("#current-habit-label")
        ?.classList.remove("active");
      const switchingTab = id;
      console.log("id :>> ", oppositeLink?.parentNode.classList);
      console.log("id :>> ", navItem?.classList);

      document.querySelector(".mask-wrapper").style.height === "5rem"
        ? showMegaMenu(idx)
        : hideMegaMenu();
    });
  });
  const calendarWidget = document.querySelector(".date-card-wrapper");
  const habitLabel = document.querySelector("#current-habit-label");

  // habitLabel.addEventListener("click", );

  // calendarWidget.addEventListener("mouseenter", showMegaMenu);
  // calendarWidget.addEventListener("mouseenter", checkAndUpdateCalendar);
  // calendarWidget.addEventListener("mouseleave", hideMegaMenu);
});
