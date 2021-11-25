import React from "react";

import { MenuList } from "../../MenuList";

export const HoverableLink = ({
  id,
  classString,
  label,
  listItems,
  showMegaMenu,
  hideMegaMenu,
}) => {
  const handleClick = (e) => {
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
    this.classList.add("active");
    oppositeLink?.parentNode.classList.remove("active");
    document.querySelector("#current-habit-label")?.classList.add("inactive");
    document.querySelector("#current-habit-label")?.classList.remove("active");
    const switchingTab = id;
    // console.log("id :>> ", oppositeLink?.parentNode.classList);
    // console.log("id :>> ", navItem?.classList);

    document.querySelector(".mask-wrapper").style.height === "5rem"
      ? showMegaMenu(idx)
      : hideMegaMenu();
  };

  const isDemo = false;
  return (
    <li className={`hoverable ${classString}`} onClick={handleClick}>
      <span id={id}>{label}</span>
      <div className="mega-menu">
        <div
          className={
            isDemo
              ? "mega-menu-wrapper bg-gray-600"
              : "mega-menu-wrapper bg-balance-pshades-dark"
          }
        >
          <div className="inset-wrapper" />
          <div className="hero-message">
            <h2>View your Habits</h2>
            <p>Track and visualise using these views:</p>
          </div>
          <div className="inset">
            <MenuList listItems={listItems} />
          </div>
        </div>
      </div>
    </li>
  );
};
