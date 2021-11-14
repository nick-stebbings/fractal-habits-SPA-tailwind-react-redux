import React from "react";

export const GeneralButton = ({ colorString, id, name, dataAttr, label }) => {
  return (
    <div className="button-container general-button">
      <span className={colorString}>
        <button
          type="submit"
          id={id}
          name={name}
          data-id={dataAttr}
          type="button"
          className="flex-no-shrink text-balance-buttontext-neutral rounded-xl font-heavy flex items-center h-12 px-2 font-sans tracking-wide uppercase"
        >
          {label}
        </button>
      </span>
    </div>
  );
};
