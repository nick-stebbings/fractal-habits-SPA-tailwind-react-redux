import React from "react";
import { isSmallScreen, isSuperSmallScreen } from "app/helpers";

import {
  positiveCol,
  negativeCol,
  noNodeCol,
  parentPositiveCol,
  neutralCol,
} from "app/constants";

function getColor(completedStatus) {
  switch (completedStatus) {
    case true:
      return positiveCol;
    case false:
      return negativeCol;
    case "OOB":
      return noNodeCol;
    case "noHabitDate":
      return neutralCol;
    case "parentCompleted":
      return parentPositiveCol;
    default:
      return noNodeCol;
  }
}

export const DateCard = ({ date, completedStatus, isToday }) => {
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
      <span className="font-std block uppercase">{weekday || <br />}</span>
      <span className="font-std block text-sm md:text-xl">{monthday}</span>
      <span className="block">{month}</span>
      <svg className="w-8 h-8 md:w-10 md:h-10 mt-1" viewBox="0 0 48 48">
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
            stroke="black"
          />
        </g>
      </svg>
    </div>
  );
};
