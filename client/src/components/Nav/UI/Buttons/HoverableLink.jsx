import React from "react";

import MenuList from "../../MenuList";

export const HoverableLink = ({ id, classString, label, children }) => {
  return (
    <li className={`hoverable ${classString}`}>
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
            <MenuList>{children}</MenuList>
          </div>
        </div>
      </div>
    </li>
  );
};
