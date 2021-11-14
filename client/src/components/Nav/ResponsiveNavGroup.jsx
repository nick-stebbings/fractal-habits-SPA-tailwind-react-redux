import React from "react";
import ResponsiveNavLink from "./UI/Buttons/ResponsiveNavLink.jsx";

const ResponsiveNavGroup = ({ id, classString, label, subpaths }) => {
  // oncreate: ({ dom }) => {
  //   dom.addEventListener('click', (e) => {
  //     if (e.target.tagName === 'A') {
  //       // Collapse responsive menu when you click active link
  //       document.getElementById('hamburger').checked = false;
  //     }
  //   });
  // },
  return (
    <li
      className="responsive-nav-group flex flex-wrap w-3/4 py-4 mx-auto mt-2"
      id={id}
    >
      <h2 id={id} className={classString} style={{ flexBasis: 100 }}>
        {label}
      </h2>
      <ul className="responsive-nav-link flex flex-wrap justify-around h-full">
        {Object.keys(subpaths).map((path, idx) => (
          <ResponsiveNavLink
            key={idx}
            url={path}
            enabled={!!subpaths[path].status}
            details={subpaths[path]}
          />
        ))}
      </ul>
    </li>
  );
};

export default ResponsiveNavGroup;
