import React, { useState } from "react";
// @ts-ignore
import { useAppSelector } from "app/hooks";
import { Link } from "react-router-dom";

// @ts-ignore
import { stringifyDate } from "features/habitDate/utils";
// @ts-ignore
import { selectCurrentSpace, selectThisWeekSpaces } from "features/space/slice";
// @ts-ignore
import { selectCurrentHabit } from "features/habit/selectors";
// @ts-ignore
import { selectIsCompletedDate } from "features/habitDate/selectors";

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
  const slideIn = (e) => {
    if (!isMobile || e.target.classList.contains("cal-date-nav")) return;
    e.currentTarget.style.right = "-3rem";
    document.querySelector(".mask-wrapper").style.height = "21rem";
    document.getElementById("hamburger").checked = false;
    document.querySelector(
      ".mask-wrapper .wide-nav"
    ).style.borderTopRightRadius = "1.5rem";
    document.querySelector(".date-card-wrapper").style.maxWidth =
      window.innerWidth < 480 ? "83%" : "78%";
    document.querySelector(".habit-description-label").style.left = "-3em";
    document.querySelector(".cal-date-nav-r").style.display = "initial";
    document.getElementById("current-habit-label-sm").style.borderBottomWidth =
      "0px";
    setMobileFullyVisible(true);
  };
  const slideOut = (e) => {
    if (!isMobile || e.target.classList.contains("cal-date-nav")) return;
    console.log("slidout :>> ");
    e.currentTarget.style.right = "calc(100% - 4rem)";
    document.querySelector(".mask-wrapper").style.height = "initial";
    document.querySelector(
      ".mask-wrapper .wide-nav"
    ).style.borderTopRightRadius = "0rem";
    document.querySelector(".habit-description-label").style.left = "0rem";
    document.querySelector(".date-card-wrapper").style.maxWidth = "97%";
    document.getElementById("current-habit-label-sm").style.borderBottomWidth =
      "3px";
    document.querySelector(".cal-date-nav-r").style.display = "none";
    setMobileFullyVisible(false);
  };
  const toggleSlide = (e) => {
    console.log("e.target.classList :>> ", e.target.classList);
    if (!isMobile || e.target.classList.contains("cal-date-nav")) return;
    mobileFullyVisible ? slideIn(e) : slideOut(e);
    setMobileFullyVisible(!mobileFullyVisible);
  };

  const currentHabit = useAppSelector(selectCurrentHabit);
  const currentWeek = useAppSelector(selectThisWeekSpaces);
  const currentSpace = useAppSelector(selectCurrentSpace);

  return (
    <div
      className="calendar-widget lg:top-20 top-20 lg:flex lg:right-6 flex-nowrap absolute justify-end w-full pt-8"
      onClick={toggleSlide}
    >
      <div className="habit-description-label gap-y-2 rounded-3xl text-balance-basic-black xl:flex relative top-0 z-0 pl-2 flex flex-col w-full overflow-none lg:items-center bg-gray-100 border-4 pb-12 md:pb-0">
        <div className="flex justify-end flex-col relative">
          <h2 className="mt-4 underline">Description</h2>
          <span className="">{currentHabit.meta.description}</span>
          <h2 className="flex mt-1 underline">Initiated On</h2>
          <span>{stringifyDate(currentHabit.timeframe.fromDate)}</span>
          <i
            className="cal-date-nav fa fa-chevron-circle-left text-3xl ml-2 absolute -bottom-16 -left-1 text-balance-tershades-dark hover:text-balance-sshades-desat lg:hidden"
            onClick={handlePrev}
          />
          <i
            className="cal-date-nav cal-date-nav-r fa fa-chevron-circle-right text-3xl ml-2 absolute -bottom-16 right-4 text-balance-tershades-dark hover:text-balance-sshades-desat lg:hidden"
            onClick={handleNext}
            style={{ display: "none" }}
          />
        </div>
        <i className="fa-solid fa-circle-info" />
        <Link to={`habits/list?currentHabit=${"HabitStore.current()?.id"}`}>
          <span className={"absolute top-2  right-3 sm:right-4"}>
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
          <span className={"absolute top-12  right-3 sm:right-4"}>
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
                strokeWidth="1.5"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </Link>
        <span className={"lg:hidden absolute top-24 right-3 sm:right-4"}>
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
        className="date-card-wrapper rounded-3xl flex-end -mt-14 border-1 flex justify-end w-full gap-1 lg:gap-2 bg-transparent pt-4 md:pt-1 lg:pt-0 md:ml-6"
        onMouseEnter={(e) => {
          showMegaMenu();
          window.innerWidth < 1024 &&
            (document.querySelector(".date-card-wrapper").style.opacity = 1);
        }}
        onMouseLeave={(e) => {
          hideMegaMenu();
          window.innerWidth < 1024 &&
            (document.querySelector(".date-card-wrapper").style.opacity = 0);
        }}
      >
        {currentWeek &&
          currentWeek.map(({ timeframe: { fromDate } }, idx) => {
            const isOOB = currentHabit?.timeframe.fromDate > fromDate;
            const isCompleted = useAppSelector(selectIsCompletedDate(fromDate));
            return (
              <DateCard
                key={idx}
                date={fromDate && stringifyDate(fromDate)}
                completedStatus={isOOB ? "OOB" : isCompleted}
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
