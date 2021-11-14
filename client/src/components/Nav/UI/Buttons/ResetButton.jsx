import React from "react";

export const ResetButton = ({ id, label }) => {
  return (
    <div className="button-container reset-button">
      <button
        id={id}
        className="flex-no-shrink text-balance-buttontext-neutral rounded-xl font-heavy flex items-center h-12 px-2 font-sans tracking-wide uppercase"
      >
        {label}
      </button>
    </div>
  );
};
