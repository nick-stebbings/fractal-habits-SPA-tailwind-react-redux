import React from "react";
import { ResponsiveNavLink } from "./UI/Buttons/ResponsiveNavLink";

export const ResponsiveNavGroup = ({ id, classString, label, subpaths }) => {
  return (
    <li
      className="responsive-nav-group flex flex-wrap w-3/4 py-6 mx-auto"
      id={id}
    >
      <h2 id={id} className={classString} style={{ flexBasis: 100 }}>
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
