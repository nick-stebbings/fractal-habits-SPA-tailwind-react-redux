import { React } from "react";

export const FormHeader = ({
  domainDescription,
  iconPath,
  iconColor,
  title,
}) => {
  return (
    <div class="flex items-center space-x-5">
      <div class="form-header flex flex-shrink-0 justify-center items-center w-14 h-14 font-mono rounded-full bg-balance-tershades-gray">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class={iconColor}
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
      <div class="block self-start pl-2 text-xl font-semibold text-gray-700">
        <h2 class="leading-relaxed">{title}</h2>
        <p class="text-sm font-normal leading-relaxed text-gray-500">
          {domainDescription}
        </p>
      </div>
    </div>
  );
};
