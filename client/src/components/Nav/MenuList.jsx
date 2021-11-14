import React from "react";

import { MenuListCard } from "./UI/MenuListCard";
// import { addActiveMenuStyles } from "../../../../assets/scripts/utilities";

export const MenuList = ({ listItems }) => {
  const listPaths = Object.keys(listItems);
  return listPaths.map((route, index) => {
    const { status, title, description, icon } = listItems[route];
    return (
      <MenuListCard
        key={index}
        id={`menu-list-card-${index}`}
        // enabled={!!status}
        title={title}
        subtitle={description}
        urlString={`${route}`}
        icon={icon}
      />
    );
  });
};
