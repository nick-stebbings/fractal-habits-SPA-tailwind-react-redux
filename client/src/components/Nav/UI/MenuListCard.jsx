import React from "react";
import { Link, useHistory } from "react-router-dom";
import tree from "/images/icons/tree.svg";
import radial from "/images/icons/tree.svg";
import cluster from "/images/icons/tree.svg";

export const MenuListCard = ({
  title,
  subtitle,
  urlString,
  icon,
  isEnabled,
}) => {
  const isDemo = false;
  let history = useHistory();
  function handleClick() {
    history.push(urlString);
  }
  const getIcon = (str) => {
    switch (str) {
      case "tree":
        return tree;
      case "radial":
        return radial;
      case "cluster":
        return cluster;
    }
  };

  return (
    <div
      className={
        isEnabled
          ? "enabled menu-card rounded-2xl flex flex-col justify-start h-full text-black bg-gray-100 shadow-xl"
          : "disabled menu-card rounded-2xl flex flex-col justify-start h-full text-black bg-gray-100 shadow-xl"
      }
    >
      <div className="overlay flex items-center justify-center">
        <h3>Under Construction</h3>
      </div>
      <div className="flex items-center justify-center">
        <h3 className="flex px-2 mb-2">{title}</h3>
        <div className="text-balance-pshades-dark w-18 h-18 flex items-center justify-center">
          <img src={getIcon(icon)}></img>
        </div>
      </div>
      <div className="flex flex-col items-center" style={{ flexBasis: "75%" }}>
        <button className="menu-card-button" onClick={handleClick}>
          <Link to={isDemo ? `${urlString}?demo=true` : urlString}>
            Let's Go
          </Link>
        </button>
        <p className="text-tershades-gray mt-4">{subtitle}</p>
      </div>
    </div>
  );
};
