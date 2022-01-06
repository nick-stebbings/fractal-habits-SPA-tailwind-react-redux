import React from "react";

export const CancelButton = ({
  id,
  name,
  disabled,
  classString,
  type,
  label,
  handleClose,
}) => {
  return (
    <div className="cursor-pointer button-container cancel-button">
      <button
        id={id}
        type="reset"
        name={name}
        disabled={disabled}
        onClick={handleClose}
        className={
          classString
            ? `${classString} mr-2 flex-no-shrinkrounded-3xl text-balance-buttontext-neutral font-heavy flex items-center h-8 my-1 font-sans tracking-wide uppercase`
            : "flex-no-shrink mx-3 text-balance-buttontext-neutral font-heavy flex items-center h-8 my-1 font-sans tracking-wide uppercase"
        }
        style={{ padding: type == "small" ? "0" : "0 0.5rem" }}
      >
        {type == "small" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        ) : (
          label
        )}
      </button>
    </div>
  );
};
