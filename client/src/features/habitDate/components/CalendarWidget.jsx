import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import DateTime from "luxon/src/datetime.js";

import { getThisWeekSpaces } from "app/features/space/slice";
import DateCard from "./DateCard.jsx";

const CalendarWidget = (props) => {
  const dispatch = useAppDispatch();
  const currentWeek = useAppSelector(getThisWeekSpaces);

  const [spaces, setSpaces] = useState(currentWeek);

  return (
    <div className="top-28 rounded-3xl lg:flex right-6 flex-nowrap absolute justify-end hidden w-full h-full pt-1">
      <div class="-left-12 bg-gray-100 border-1 border-balance-basic-dgray flex flex-col items-center habit-description-label gap-y-2 hidden overflow-auto relative rounded-3xl text-balance-basic-black top-0 w-full xl:flex z-0">
        <h2 className="flex underline">Description</h2>
        <span className="flex">{"description"}</span>
        <h2 className="flex underline">Initiated On</h2>
        <span className="flex">{"date"}</span>
        <i className="fa-solid fa-circle-info" />
        {/* <m.route.Link
          className={"absolute top-3 right-3"}
          href={
            !m.route.param("demo")
              ? `habits/list?currentHabit=${HabitStore.current()?.id}`
              : `habits/list?demo=true&currentHabit=${HabitStore.current()?.id}`
          }
          selector="a"
        > */}{" "}
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
        {/* </m.route.Link>
        <m.route.Link
          className={"absolute top-16 right-3"}
          href={
            !m.route.param("demo")
              ? `habits/new?currentHabit=${HabitStore.current()?.id}`
              : `habits/new?demo=true&currentHabit=${HabitStore.current()?.id}`
          }
          selector="a"
        > */}{" "}
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
        {/* </m.route.Link> */}
      </div>
      <div
        className="date-card-wrapper rounded-3xl flex-end -mt-14 border-1 flex justify-end w-full gap-2 bg-transparent"
        style="max-width:75%"
      >
        {spaces &&
          spaces.map((date, idx) => (
            <DateCard
              key={idx}
              date={"a date"}
              today={false}
              completedStatus={habitDates && habitDates[idx]?.completed_status}
            />
          ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
