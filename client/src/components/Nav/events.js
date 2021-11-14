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

let dateIndex;
let maxDate;
let minDate;
let currentHabitDate;
// const todaysDate = DateTime.now().startOf("day");

// DateStore.indexDatesOfHabit(HabitStore.current());
// dateIndex = DateStore.listForHabit().indexOf(DateStore.current());
// [minDate, maxDate] = updatedMinAndMaxForCurrentHabit();

// currentHabitDate =
//   DateStore.current() && DateTime.fromSQL(DateStore.current().h_date);
// [minDate, maxDate] = updatedMinAndMaxForCurrentHabit();

// if (newDate()) {
//   DateStore.submit({ h_date: maxDate.plus({ days: 1 }).toISODate() })
//     .then(DateStore.index)
//     .then(() => {
//       DateStore.indexDatesOfHabit(HabitStore.current());
//       maxDate = DateTime.fromMillis(
//         DateTime.fromSQL(DateStore.current().h_date).ts
//       );
//       newDate(false);
//     });
// }

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
    // dateIndex = DateStore.listForHabit()
    //   .map(sanitiseForDataList)
    //   .indexOf(e.target.value);
    // let newDate = DateStore.listForHabit()[dateIndex];
    // DateStore.current(newDate);
    // changedDate(true);
  });

  const prevDateSelector = document.getElementById("prev-date-selector");
  const nextDateSelector = document.getElementById("next-date-selector");
  [...dateInputs].forEach((input) => {
    input?.addEventListener("change", (e) => {
      // e.stopPropagation();
      // dateIndex = DateStore.listForHabit()
      //   .map(sanitiseForDataList)
      //   .indexOf(e.target.value);
      // let newDate = DateStore.listForHabit()[dateIndex];
      // DateStore.current(newDate);
      // changedDate(true);
    });
  });
  prevDateSelector?.addEventListener("click", () => {
    // if (!HabitStore.current()) return;
    // if (currentHabitDate?.toLocaleString() !== minDate?.toLocaleString()) {
    //   dateIndex--;
    //   let newDate = DateStore.listForHabit()[dateIndex] || DateStore.current();
    //   DateStore.current(newDate);
    // }
    // changedDate(true);
  });
  nextDateSelector?.addEventListener("click", () => {
    // if (!HabitStore.current()) return;
    // if (currentHabitDate.toLocaleString() !== maxDate.toLocaleString()) {
    //   dateIndex++;
    //   let newDate = DateStore.listForHabit()[dateIndex] || DateStore.current();
    //   DateStore.current(newDate);
    // }
    // changedDate(true);
  });

  // Habit list
  // document.querySelector("#habit-list").addEventListener("click", (e) => {
  //   if (e.target.tagName === "BUTTON") {
  //     e.stopPropagation();

  //     if (!e.target.classList.contains("selected")) {
  //       const lastSelected = document.querySelector(".selected");
  //       lastSelected && lastSelected.classList.toggle("selected");
  //       e.target.classList.add("selected");
  //     }
  //     // HabitStore.current(
  //     //   HabitStore.filterById(+e.target.getAttribute("data-id"))[0]
  //     // );
  //     // changedHabit(true);
  //   }
  // });

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
