import React from "react";

export const InfoBox = ({ title, message, type, iconPath, iconColor }) => {
  return (
    <div className="sm:m-8 flex items-center m-4">
      <div className="form-header w-14 h-14 bg-balance-tershades-gray flex items-center justify-center flex-shrink-0 font-mono rounded-full">
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
      <div className="self-start block pl-2 text-xl font-semibold text-gray-700">
        <h2 className="leading-relaxed">{title}</h2>
        <p className="text-sm font-normal leading-relaxed text-gray-500">
          {message}
        </p>
      </div>
    </div>
  );
};
