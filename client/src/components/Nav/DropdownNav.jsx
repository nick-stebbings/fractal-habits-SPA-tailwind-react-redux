import React, { useEffect } from "react";
// import { pendingCalendarRefresh } from '../../../../assets/scripts/controller';
import HoverableLink from "./UI/Buttons/HoverableLink";
import "events";

export const DropdownNav = function ({ routes }) {
  const isDemo = false;
  return (
    <nav className="nav">
      <div className="nav-container">
        <ul className="nav-links">
          {isDemo && <li id="demo-indicator">DEMO mode</li>}
          {routes.map((route, index) => (
            <HoverableLink
              key={index}
              label={route.label}
              href={Object.keys(route.subpaths)[0]}
              class={routes.selected === route.label ? "active" : ""}
              id={`nav-${route.label.toLowerCase()}`}
              subpaths={route.subpaths}
            >
              {routes[index].subpaths}
            </HoverableLink>
          ))}
        </ul>
        <div className="md:block hidden" id="current-habit-label">
          <span id="current-habit">Habit</span>
          <span id="current-habit">{"No Habits Registered OR HABIT NAME"}</span>
        </div>
      </div>
    </nav>
  );
};
