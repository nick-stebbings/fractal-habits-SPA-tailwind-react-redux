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
});
