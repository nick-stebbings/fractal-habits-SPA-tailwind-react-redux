import React from "react";
import { isSmallScreen, isSuperSmallScreen } from "app/helpers";
import { getColor } from "features/hierarchy/components/helpers";

import { parentPositiveBorderCol, positiveColLighter } from "app/constants";

export const DateCard = ({ date, completedStatus, isToday, handleClick }) => {
  const [weekday, month, monthday] = date.split(/\W+/);
  return (
    <div
      className="date-card bg-gray-50 rounded-3xl flex flex-col items-center justify-start flex-grow md:gap-1 p-1 md:p-3 md:pt-8 -mt-2.5"
      style={{
        borderColor: isToday ? "#e3922f" : "#fefefe",
        boxSizing: "initial",
        borderWidth: "3px",
        maxWidth: isSmallScreen()
          ? isSuperSmallScreen()
            ? "25px"
            : "35px"
          : "60px",
      }}
    >
      <span onClick={handleClick} className="font-std block uppercase">
        {weekday || <br />}
      </span>
      <span className="font-std block text-sm md:text-xl w-full text-center">
        {monthday}
      </span>
      <span className="block">{month}</span>
      <svg className="w-10 h-10 md:w-12 md:h-12 mt-1" viewBox="-5 0 56 56">
        <g
          transform={`translate(14, 14) scale(${
            isSmallScreen() ? "0.8" : "1"
          })`}
        >
          <circle
            r="20"
            cx="12"
            cy="12"
            fill={getColor(completedStatus)}
            stroke={
              getColor(completedStatus) == positiveColLighter
                ? parentPositiveBorderCol
                : "black"
            }
            strokeWidth={
              getColor(completedStatus) == positiveColLighter ? 10 : 1
            }
          />
        </g>
      </svg>
    </div>
  );
};
