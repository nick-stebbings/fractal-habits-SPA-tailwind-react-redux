import React, { useState } from "react";
// @ts-ignore
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Link } from "react-router-dom";

// @ts-ignore
import { stringifyDate } from "features/habitDate/utils";
// @ts-ignore
import { selectCurrentSpace, selectThisWeekSpaces } from "features/space/slice";
// @ts-ignore
import { selectIsCompletedDate } from "features/habitDate/selectors";

import { DateCard } from "./DateCard";

export const CalendarWidget = () => {
  const dispatch = useAppDispatch();
  const currentWeek = useAppSelector(selectThisWeekSpaces);
  const currentSpace = useAppSelector(selectCurrentSpace);
  const [thisWeekSpaces, setWeeks] = useState(currentWeek);

  return (
    <div className="top-28 rounded-3xl lg:flex right-6 flex-nowrap absolute justify-end w-full h-full pt-1">
      <div className="-left-12 border-1 border-balance-basic-dgray habit-description-label gap-y-2 rounded-3xl text-balance-basic-black xl:flex relative top-0 z-0 flex flex-col items-center w-full overflow-auto bg-gray-100">
        <h2 className="flex underline">Description</h2>
        <span className="flex">{"description"}</span>
        <h2 className="flex underline">Initiated On</h2>
        <span className="flex">{"date"}</span>
        <i className="fa-solid fa-circle-info" />
        <Link to={`habits/list?currentHabit=${"HabitStore.current()?.id"}`}>
          <span className={"absolute top-3 right-3"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </span>
        </Link>
        <Link to={`habits/new?currentHabit=${"currentid"}`}>
          <span className={"absolute top-16 right-3"}>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </Link>
      </div>
      <div
        className="date-card-wrapper rounded-3xl flex-end -mt-14 border-1 flex justify-end w-full gap-2 bg-transparent"
        style={{ maxWidth: "75%" }}
      >
        {thisWeekSpaces &&
          thisWeekSpaces.map(({ timeframe: { fromDate } }, idx: number) => (
            <DateCard
              key={idx}
              date={fromDate && stringifyDate(fromDate)}
              completedStatus={useAppSelector(selectIsCompletedDate(fromDate))}
              isToday={
                stringifyDate(currentSpace.timeframe.fromDate) ===
                stringifyDate(fromDate)
              }
            />
          ))}
      </div>
    </div>
  );
};
