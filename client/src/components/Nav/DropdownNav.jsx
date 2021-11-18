import React from "react";
import { useAppSelector } from "app/hooks";
// import { pendingCalendarRefresh } from '../../../../assets/scripts/controller';

import { selectCurrentHabit } from "features/habit/selectors";
import { HoverableLink } from "./UI/Buttons/HoverableLink";
import "./events.js";

export const DropdownNav = function ({ routes }) {
  const currentHabit = useAppSelector(selectCurrentHabit);
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
              classString={routes.selected === route.label ? "active" : ""}
              id={`nav-${route.label.toLowerCase()}`}
              subpaths={route.subpaths}
              listItems={routes[index].subpaths}
            />
          ))}
        </ul>
        <div className="md:block hidden" id="current-habit-label">
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
