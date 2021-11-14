import React from "react";
import { Link } from "react-router-dom";

export const MenuListCard = ({ title, subtitle, url, icon }) => {
  // oncreate: ({ attrs, dom }) => {
  //   dom.classList.add(attrs.enabled ? "enabled" : "disabled");
  // },
  // view: ({ attrs }) => (
  const isDemo = false;
  return (
    <div className="menu-card rounded-2xl flex flex-col justify-between h-full text-black bg-gray-100 shadow-xl">
      <div className="overlay flex items-center justify-center">
        <h3>Under Construction</h3>
      </div>
      <div className="flex items-center justify-center">
        <h3 className="flex px-2 mb-2">{title}</h3>
        <div className="text-balance-pshades-dark w-18 h-18 flex items-center justify-center">
          <img src={icon}></img>
        </div>
      </div>
      <div className="flex flex-col items-center" style="flex-basis: 75%">
        <Link to={isDemo ? `${url}?demo=true` : url}>
          <button className="menu-card-button">"Let's Go"</button>{" "}
        </Link>
        <p className="text-tershades-gray mt-4">{subtitle}</p>
      </div>
    </div>
  );
};
