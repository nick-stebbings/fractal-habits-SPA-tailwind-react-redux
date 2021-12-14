import React, { useState } from "react";
// @ts-ignore
import { store } from "app/store";
import { useAppSelector } from "app/hooks";
import { Link } from "react-router-dom";

// @ts-ignore
import { stringifyDate } from "features/habitDate/utils";
// @ts-ignore
import {
  selectCurrentSpace,
  selectThisWeekSpaces,
  selectRelativeDateId,
} from "features/space/slice";
// @ts-ignore
import { selectCurrentHabit } from "features/habit/selectors";
// @ts-ignore
import { selectCurrentHierarchyRecords } from "features/hierarchy/selectors";
// @ts-ignore
import {
  selectAccumulatedStatusForDate,
  selectStoredHabitDates,
} from "features/habitDate/selectors";

import { DateCard } from "./DateCard";

export const CalendarWidget = ({
  handlePrev,
  handleNext,
  hideMegaMenu,
  showMegaMenu,
}) => {
  const isMobile = window.matchMedia(
    "only screen and (max-width: 1024px)"
  ).matches;
  const [mobileFullyVisible, setMobileFullyVisible] = useState(true);
  const slideIntoView = (e) => {
    e.currentTarget.style.right = 0;

    document.getElementById("hamburger").checked = false;
    document.querySelector(
      ".mask-wrapper .wide-nav"
    ).style.borderTopRightRadius = "1.5rem";

    document.querySelector(".mask-wrapper").style.height = "21rem";
    document.querySelector(".date-card-wrapper").style.opacity = "1";
    document.querySelector(".date-card-wrapper").style.justifyContent =
      window.innerWidth > 480 ? "center" : "flex-end";
    document.querySelector(".habit-description-label").style.left = "initial";
    document.getElementById("current-habit-label-sm").style.borderBottomWidth =
      "0px";
    document.querySelector(".cal-date-nav-r").style.display = "initial";
  };
  const slideOutOfView = (e) => {
    e.currentTarget.style.right =
      window.innerWidth < 480 ? "calc(100% - 3.25rem)" : "calc(100% - 4rem)";

    document.querySelector(".mask-wrapper").style.height = "initial";
    document.querySelector(
      ".mask-wrapper .wide-nav"
    ).style.borderTopRightRadius = "0rem";

    document.querySelector(".date-card-wrapper").style.justifyContent =
      "flex-end";
    document.querySelector(".habit-description-label").style.left = "0";
    document.getElementById("current-habit-label-sm").style.borderBottomWidth =
      "3px";
    document.querySelector(".cal-date-nav-r").style.display = "none";
  };
  const toggleSlide = (e) => {
    if (
      !isMobile ||
      e.target.classList.contains("cal-date-nav") ||
      e.target.classList.contains(".fa")
      // || !!e.target.closest(".date-card")
    )
      return;
    mobileFullyVisible ? slideIntoView(e) : slideOutOfView(e);
    setMobileFullyVisible(!mobileFullyVisible);
  };

  const currentHabit = useAppSelector(selectCurrentHabit);
  const currentWeek = useAppSelector(selectThisWeekSpaces);
  const currentSpace = useAppSelector(selectCurrentSpace);
  const currentHierarchyRecords = useAppSelector(selectCurrentHierarchyRecords); // Triggers re-render on new memoised hierarchies
  useAppSelector(selectStoredHabitDates); // Triggers re-render on habit date update
  return (
    <div
      className="calendar-widget lg:top-20 top-20 lg:flex lg:right-6 flex-nowrap absolute justify-end w-full pt-8"
      style={{ maxWidth: "100vw" }}
      onClick={toggleSlide}
    >
      <div className="habit-description-label lg:opacity-0 gap-y-2 rounded-3xl text-balance-basic-black xl:flex relative top-0 z-0 pl-2 flex flex-col overflow-none lg:items-center bg-gray-100 border-4 pb-12 md:pb-0">
        <div className="flex justify-start flex-col relative">
          <h2 className="mt-4 underline">Description</h2>
          <span className="min-h-16 mr-1/3">
            {currentHabit.meta.description}
          </span>
          <h2 className="flex mt-1 underline">Initiated On</h2>
          <span>{stringifyDate(currentHabit.timeframe.fromDate)}</span>
          <i
            className="cal-date-nav h-16 w-16 fa fa-chevron-circle-left text-3xl ml-1 absolute -left-1 text-balance-tershades-dark hover:text-balance-sshades-desat lg:hidden"
            onClick={handlePrev}
          />
          <i
            className="cal-date-nav h-16 w-16 cal-date-nav-r fa fa-chevron-circle-right text-3xl ml-2 absolute right-2 sm:right-8 text-balance-tershades-dark hover:text-balance-sshades-desat lg:hidden"
            onClick={handleNext}
            style={{ display: "none" }}
          />
        </div>
        <i className="fa-solid fa-circle-info" />
        <Link to={`habits/list?currentHabit=${"HabitStore.current()?.id"}`}>
          <span
            className={
              "absolute text-gray-200 pointer-events-none top-2 right-1 sm:right-4"
            }
          >
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
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </span>
        </Link>
        <Link to={`habits/new?currentHabit=${"currentid"}`}>
          <span
            className={
              "absolute text-gray-200 pointer-events-none top-12  right-1 sm:right-4"
            }
          >
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
                strokeWidth="1.5"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </Link>
        <span className={"lg:hidden absolute top-24 right-1 sm:right-4"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-balance-sshades-desat cursor-pointer w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d={
                !mobileFullyVisible
                  ? "M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                  : "M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              }
            />
          </svg>
        </span>
      </div>
      <div
        className="date-card-wrapper rounded-3xl flex-end -mt-13 border-1 flex justify-end w-full gap-1 lg:gap-2 bg-transparent"
        onMouseLeave={async (e) => {
          const tO = setTimeout(() => {
            hideMegaMenu();
          }, 1000);
          console.log("tO :>> ", tO);
        }}
      >
        {currentWeek &&
          currentHierarchyRecords &&
          currentWeek.map(({ timeframe: { fromDate } }) => {
            const relativeDateId = useAppSelector(
              selectRelativeDateId(fromDate)
            );
            return (
              <DateCard
                key={fromDate}
                date={fromDate && stringifyDate(fromDate)}
                completedStatus={selectAccumulatedStatusForDate(
                  fromDate,
                  relativeDateId
                )(store.getState())}
                isToday={
                  stringifyDate(currentSpace.timeframe.fromDate) ===
                  stringifyDate(fromDate)
                }
              />
            );
          })}
      </div>
    </div>
  );
};
