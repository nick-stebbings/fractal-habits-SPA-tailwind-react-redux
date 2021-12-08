import React from "react";

import { MenuList } from "../../MenuList";

const LINK_IDS = ["nav-visualise", "nav-habits"];
const oppositeLink = (idx) =>
  document.querySelector("li.hoverable #" + LINK_IDS[1 - idx]);

export const HoverableLink = ({
  id,
  classString,
  label,
  listItems,
  showMegaMenu,
  hideMegaMenu,
  isOpen,
  setIsOpen,
}) => {
  const handleOpen = (e, idx) => {
    // Toggle active classes
    console.log("e.currentTarget :>> ", e.currentTarget);
    e.currentTarget.classList.toggle("active");
    oppositeLink(idx)?.parentNode.classList.remove("active");
    document.querySelector("#current-habit-label")?.classList.add("inactive");
    document.querySelector("#current-habit-label")?.classList.remove("active");

    showMegaMenu(idx);
    setIsOpen(true);
  };
  const handleClose = () => {
    hideMegaMenu();
    setIsOpen(false);
  };

  const handleClick = (e) => {
    const { id } = e.target;
    const idx = LINK_IDS.indexOf(id);
    if (
      document.body.classList.contains("scroll-down") ||
      document.body.classList.contains("scroll-up")
    ) {
      // Allow finding the top of the page again using active nav list item
      document.body.scroll(0, 0);
    }

    const currentOpenId = document.querySelector(".hoverable.active");
    if (!!currentOpenId) {
      currentOpenId.classList.toggle("active");
      console.log(
        "currentOpenId.children[0] == oppositeLink(idx) :>> ",
        currentOpenId.children[0] == oppositeLink(idx)
      );
      // if (currentOpenId.children[0] == oppositeLink(idx)) {
      //   handleClose();
      //   setIsOpen(false);
      // }
    }
    isOpen ? handleClose() : handleOpen(e, idx);
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
