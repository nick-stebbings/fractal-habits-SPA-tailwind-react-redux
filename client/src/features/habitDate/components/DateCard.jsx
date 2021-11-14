import React from "react";

import { positiveCol, negativeCol, noNodeCol } from "app/constants";
function getColor (completedStatus) {
    switch (completedStatus) {
      case true:
        return positiveCol;
      case false:
        return negativeCol;
      default:
        return noNodeCol;
    }
  }

export const DateCard = ({ date, completedStatus, isToday }) => {
  const [weekday, month, monthday] = date.split(/\W+/);

  return (
    <div
      className="date-card bg-gray-50 rounded-3xl flex flex-col items-center justify-start flex-grow gap-1 p-2 pt-1 -mt-2.5"
      style={{
        borderColor: isToday ? "#e3922f" : "#fefefe",
        boxSizing: "initial",
        borderWidth: "3px",
        maxWidth: "125px",
      }}
    >
      <span className="font-std block uppercase">{weekday || <br />}</span>
      <span className="font-std block text-xl">{monthday}</span>
      <span className="block">{month}</span>
      <svg className="w-10 h-10 mt-1" viewBox="0 0 48 48">
        <g transform="translate(12, 14)">
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
