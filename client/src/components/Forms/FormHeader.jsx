import React from "react";

export const FormHeader = ({
  domainDescription,
  iconPath,
  iconColor,
  title,
}) => {
  return (
    <div className="flex items-center space-x-5">
      <div className="form-header flex flex-shrink-0 justify-center items-center w-14 h-14 font-mono rounded-full bg-balance-tershades-gray">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={iconColor}
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d={iconPath}
          />
        </svg>
      </div>
      <div className="block self-start pl-2 text-sm sm:text-xl font-semibold text-gray-700">
        <h2 className="leading-tight md:leading-relaxed">{title}</h2>
        <p className="text-sm font-normal leading-relaxed text-gray-500">
          {domainDescription}
        </p>
      </div>
    </div>
  );
};
