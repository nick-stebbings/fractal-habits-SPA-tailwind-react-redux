import React from "react";

export const CancelButton = ({
  id,
  name,
  disabled,
  classString,
  label,
  handleClose,
}) => {
  return (
    <div className="button-container cancel-button">
      <button
        id={id}
        type="reset"
        name={name}
        disabled={disabled}
        onClick={handleClose}
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
