import React, { useEffect, useState } from "react";

import { store } from "app/store";
import { isTouchDevice, isSmallScreen } from "app/helpers";
import { useAppSelector } from "app/hooks";
import { Link } from "react-router-dom";

import { stringifyDate } from "features/habitDate/helpers";

import {
  selectCurrentSpace,
  selectThisWeekSpaces,
  selectRelativeDateId,
} from "features/space/slice";

import { selectCurrentHabit } from "features/habit/selectors";

import { selectCurrentHierarchyRecords } from "features/hierarchy/selectors";

import {
  selectAccumulatedStatusForDate,
  selectStoredHabitDates,
} from "features/habitDate/selectors";

import { DateCard } from "./DateCard";
import { selectDeleteCompleted, getConfirmStatus } from "features/ui/selectors";

export const CalendarWidget = ({
  handlePrev,
  handleNext,
  hideMegaMenu,
  showMegaMenu,
  scrollRef,
}) => {
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
    document.getElementById("reset-tree").dispatchEvent(new Event("click"));
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
      !isTouchDevice() ||
      e.target.classList.contains("cal-date-nav") ||
      e.target.classList.contains(".fa")
      // || !!e.target.closest(".date-card")
    ) {
      if (!isTouchDevice() && isSmallScreen()) {
        window.FlashMessage.warning(
          "This is the desktop version, for full functionality please retry on a mobile or in DevTools after a refresh",
          {
            interactive: true,
            timeout: 4000,
          }
        );
      }
      return;
    }
    mobileFullyVisible ? slideIntoView(e) : slideOutOfView(e);
    setMobileFullyVisible(!mobileFullyVisible);
  };

  const currentHabit = useAppSelector(selectCurrentHabit);
  const currentWeek = useAppSelector(selectThisWeekSpaces);
  const currentSpace = useAppSelector(selectCurrentSpace);

  const deleteCompleted = useAppSelector(selectDeleteCompleted); // Triggers re-render on new memoised hierarchies
  const openDialogBox = useAppSelector(getConfirmStatus); // Triggers re-render on new memoised hierarchies
  const currentHierarchyRecords = useAppSelector(selectCurrentHierarchyRecords); // Triggers re-render on new memoised hierarchies
  useAppSelector(selectStoredHabitDates); // Triggers re-render on habit date update

  useEffect(() => {
    if (deleteCompleted || openDialogBox) hideMegaMenu();
  }, [deleteCompleted, openDialogBox]);

  return (
    <div
      className="calendar-widget lg:top-20 top-28 lg:flex lg:right-6 flex-nowrap absolute justify-end w-full pt-12"
      style={{ maxWidth: "100vw" }}
      onClick={toggleSlide}
    >
      <div className="habit-description-label lg:opacity-0 gap-y-2 rounded-3xl text-balance-basic-black xl:flex relative top-0 z-0 pl-2 flex flex-col overflow-none lg:items-center bg-gray-100 border-4 pb-8 md:pb-0">
        <div className="flex justify-start flex-col relative">
          <h2 className="mt-4 underline">Description</h2>
          <span className="min-h-16 mr-1/3 habit-desc-text">
            {currentHabit?.meta.description}
          </span>
          <h2 className="flex mt-1 underline">Initiated On</h2>
          <span className="habit-desc-text">
            {stringifyDate(currentHabit.timeframe.fromDate)}
          </span>
          <i
            className="cal-date-nav h-16 w-16 fa fa-chevron-circle-left text-3xl ml-1 absolute left-0 active:text-balance-tershades-dark text-balance-tershades-dark hover:text-balance-sshades-desat lg:hidden"
            ref={scrollRef}
            onClick={handlePrev}
          />
          <i
            className="cal-date-nav h-16 w-16 cal-date-nav-r fa fa-chevron-circle-right text-3xl ml-2 absolute right-2 sm:right-8 active:text-balance-tershades-dark text-balance-tershades-dark hover:text-balance-sshades-desat lg:hidden"
            onClick={handleNext}
            style={{ display: "none" }}
          />
        </div>
        <i className="fa-solid fa-circle-info" />
        {/* <Link to={`habits/list?currentHabit=${"HabitStore.current()?.id"}`}> */}
        <span
          className={
            "absolute text-gray-200 pointer-events-none top-1 right-1 sm:right-4"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10"
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
        {/* </Link> */}
        {/* <Link to={`habits/new?currentHabit=${"currentid"}`}> */}
        <span
          className={
            "absolute text-gray-200 pointer-events-none top-8 sm:top-10  right-1 sm:right-4"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        {/* </Link> */}
        <span
          className={
            "lg:hidden absolute top-14 sm:top-20 right-1 sm:right-4 pt-1"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-balance-sshades-desat cursor-pointer w-8 h-8 sm:w-10 sm:h-10"
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
      <div className="date-card-wrapper rounded-3xl flex-end -mt-13 border-1 flex justify-end w-full gap-1 lg:gap-2 bg-transparent">
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
                handleClick={() => {
                  if (isTouchDevice()) return;
                  showMegaMenu();
                }}
                completedStatus={selectAccumulatedStatusForDate(
                  fromDate,
                  relativeDateId
                )(store.getState())}
                isToday={
                  stringifyDate(currentSpace.timeframe.fromDate) ===
                  stringifyDate(fromDate)
                }
                calendarWidgetIsHidden={isTouchDevice() && mobileFullyVisible}
              />
            );
          })}
      </div>
    </div>
  );
};
