import React, { useState } from "react";
import { useAppSelector } from "app/hooks";

import { selectCurrentHabit } from "features/habit/selectors";
import { HoverableLink } from "./UI/Buttons/HoverableLink";
import "./events.js";

export const DropdownNav = function ({ routes, showMegaMenu, hideMegaMenu }) {
  const handleLabelClick = (e) => {
    const menuVisible =
      document.querySelector(".mask-wrapper").style.height === "5rem";
    [...document.querySelectorAll(".nav li.hoverable")].forEach((navItem) => {
      navItem.classList.remove("active");
    });
    menuVisible ? showMegaMenu() : hideMegaMenu();
  };

  const currentHabit = useAppSelector(selectCurrentHabit);
  const isDemo = false;

  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="nav">
      <div
        className="nav-container"
        onClick={(e) => {
          if (!e.target.classList.contains("nav-container")) return;
          showMegaMenu();
        }}
      >
        <ul className="nav-links">
          {isDemo && <li id="demo-indicator">DEMO mode</li>}
          {routes.map((route, index) => (
            <HoverableLink
              key={index}
              label={route.label}
              href={Object.keys(route.subpaths)[0]}
              classString={routes.selected === route.label ? "active" : ""}
              id={`nav-${route.label.toLowerCase()}`}
              subpaths={route.subpaths}
              listItems={routes[index].subpaths}
              hideMegaMenu={hideMegaMenu}
              showMegaMenu={showMegaMenu}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          ))}
        </ul>
        <div
          className="md:block hidden"
          id="current-habit-label"
          onClick={handleLabelClick}
        >
          <span id="current-habit">Habit</span>
          <span id="current-habit">
            {currentHabit.meta.name !== ""
              ? currentHabit.meta.name
              : "No Habits Registered "}
          </span>
        </div>
      </div>
    </nav>
  );
};
