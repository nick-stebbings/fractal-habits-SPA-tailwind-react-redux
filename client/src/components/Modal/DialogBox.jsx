import React from "react";

import { CancelButton } from "../Nav/UI/Buttons/CancelButton";
import { SubmitButton } from "../Nav/UI/Buttons/SubmitButton";

export const DialogBox = ({
  title,
  message,
  type,
  iconPath,
  iconColor,
  handleClose,
  handleConfirm,
}) => {
  const randId = String(Math.ceil(Math.random() * 100));

  return (
    <div className="sm:m-8 flex items-center m-4">
      <div className="form-header mx-12 w-14 h-14 bg-balance-tershades-gray flex items-center justify-center flex-shrink-0 font-mono rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={iconColor}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={iconPath}
          />
        </svg>
      </div>
      <form id="form-dialog" className="p-0">
        <div className="self-start block pl-2 text-xl font-semibold text-gray-700">
          <h2 className="leading-relaxed">{title}</h2>
          <p className="text-sm font-normal leading-relaxed text-gray-500">
            {message}
          </p>
        </div>
        <div className="button-group py-3 mb-2 mr-4 text-sm bg-white border-t border-gray-200">
          <CancelButton
            id={`close-modal-${randId}`}
            name="close"
            label="Close"
            type={type}
            handleClose={handleClose}
          />
          <SubmitButton
            id={`submit-form-${randId}`}
            name="submit"
            label="Confirm"
            handleConfirm={handleConfirm}
          />
        </div>
      </form>
    </div>
  );
};
