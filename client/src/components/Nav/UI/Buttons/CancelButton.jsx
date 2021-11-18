import React from "react";
import { Link } from "react-router-dom";

export const CancelButton = ({
  id,
  name,
  disabled,
  classString,
  label,
  type,
}) => {
  const handleClick = function (e) {
    // dom.addEventListener("click", () => {
    // openModal(false);
    // newRecord(true);
    // attrs.modalType && attrs.modalType(false);
    // [...document.querySelectorAll(".not-added")].forEach((label) =>
    //   label.classList.remove("not-added")
    // );
    // m.route.set(m.route.get(), null);
  };
  return (
    <div className="button-container cancel-button">
      <button
        id={id}
        type="reset"
        name={name}
        disabled={disabled}
        onClick={handleClick}
        className={
          classString
            ? `${classString} mr-2 flex-no-shrinkrounded-3xl text-balance-buttontext-neutral font-heavy flex items-center h-8 px-2 my-1 font-sans tracking-wide uppercase`
            : "flex-no-shrink mx-3 text-balance-buttontext-neutral font-heavy flex items-center h-8 px-2 my-1 font-sans tracking-wide uppercase"
        }
      >
        {label}
      </button>
    </div>
  );
};
