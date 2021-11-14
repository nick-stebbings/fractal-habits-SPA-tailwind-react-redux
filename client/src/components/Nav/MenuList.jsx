import React from "react";

import MenuListCard from "./UI/MenuListCard";
// import { addActiveMenuStyles } from "../../../../assets/scripts/utilities";

export const MenuList = ({ children }) => {
  return Object.keys(children[0]).map((route, index) => (
    <MenuListCard
      key={index}
      id={`menu-list-card-${index}`}
      enabled={!!children[0][route].status}
      title={children[0][route].title}
      subtitle={children[0][route].description}
      url={`${route}`}
      icon={children[0][route].icon}
    />
  ));
};
