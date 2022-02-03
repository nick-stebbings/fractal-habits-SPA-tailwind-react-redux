import React from "react";
import { ResponsiveNavLink } from "./UI/Buttons/ResponsiveNavLink";

export const ResponsiveNavGroup = ({ id, classString, label, subpaths }) => {
  return (
    <li
      className="responsive-nav-group flex items-center flex-wrap w-5/6 py-2 mt-4 mx-auto"
      id={id}
      onClick={(e) => {
        if (e.target.tagName === "A") {
          // Collapse responsive menu when you click active link
          document.getElementById("hamburger").checked = false;
        }
      }}
    >
      <h2 id={id} className={classString} style={{ marginRight: "3rem" }}>
        {label}
      </h2>
      <ul className="responsive-nav-link flex flex-wrap justify-around h-full">
        {Object.keys(subpaths).map((path, idx) => (
          <ResponsiveNavLink
            key={idx}
            urlString={path}
            enabled={!!subpaths[path].status}
            details={subpaths[path]}
          />
        ))}
      </ul>
    </li>
  );
};

ResponsiveNavGroup;
