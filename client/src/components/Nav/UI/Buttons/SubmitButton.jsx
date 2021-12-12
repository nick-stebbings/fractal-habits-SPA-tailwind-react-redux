import React from "react";

export const SubmitButton = ({
  id,
  name,
  classString,
  disabled,
  label,
  handleConfirm,
}) => {
  return (
    <div
      name={name}
      className={
        classString
          ? `${classString} cursor-pointer button-container submit-button`
          : "cursor-pointer button-container submit-button"
      }
    >
      <button
        id={id}
        type="submit"
        value="submit"
        disabled={disabled}
        onClick={handleConfirm}
        className="flex-no-shrink text-balance-buttontext-neutral font-heavy flex items-center h-8 px-2 my-1 font-sans tracking-wide uppercase"
      >
        {label}
      </button>
    </div>
  );
};
