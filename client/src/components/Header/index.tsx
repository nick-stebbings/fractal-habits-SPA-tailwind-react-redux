import React, {useRef, useState} from "react";
import { Link } from "react-router-dom";
import MENU_ROUTES, { MENU_ROUTE_FIRST_SELECTED } from "../../routes/routeInfo";

import { DateTime } from "luxon";
import { store } from "app/store";
// @ts-ignore
import { useAppDispatch, useAppSelector } from "app/hooks";
import { debounce } from "app/helpers";

// @ts-ignore
import { selectCurrentHabit } from "features/habit/selectors";
// @ts-ignore
import slice, { selectCurrentDateId, selectCurrentDatePositionIdx, selectCurrentDate } from 'features/space/slice';
const { decrementIdx, incrementIdx } = slice.actions;

import { visActions } from "features/hierarchy/reducer";
import { selectHasStoredTreeForDateId } from "features/hierarchy/selectors";
const {updateCurrentHierarchy} = visActions
import { fetchHabitTreeREST,fetchHabitTreesREST } from "features/hierarchy/actions";

// @ts-ignore
import { CalendarWidget } from "features/habitDate/components/CalendarWidget";
import { ResponsiveNavGroup } from "../Nav/ResponsiveNavGroup";
import { DomainSelector } from "../Nav/UI/Inputs/DomainSelector";
import { DropdownNav } from "../Nav/DropdownNav";
import { DateSelector } from "../Nav/UI/Inputs/DateSelector";

import "../../assets/styles/components/MaskHeader.scss";

const showMegaMenu = (id) => {
  document.querySelector(".mask-wrapper").style.height = "357px";
  const menus = [...document.querySelectorAll(".mega-menu")];
  menus.forEach((menu, idx) => {
    if (id === idx) {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
  });
  document.querySelector(".mask-wrapper").style.zIndex = "40";
  menus.every((menu) => menu.style.display === "none") &&
    (document.querySelector(".habit-description-label").style.opacity = "1");
};

const hideMegaMenu = () => {
  document.querySelector(".mask-wrapper").style.height = "5rem";
  [...document.querySelectorAll(".mega-menu")].forEach((menu) => {
    menu.style.display = "none";
  });
  // document.querySelector(".habit-description-label").style.opacity = "0";
  document.querySelector(".mask-wrapper").style.zIndex = "10";
};

export const Header = ({ isVis }) => {
  const scrollRef = useRef(null);
  const checkBoxRef = useRef(null);
  const executeScroll = () => scrollRef.current.scrollIntoView();

  const dispatch = useAppDispatch()
  const currentDate = useAppSelector(selectCurrentDate);
  const currentDateId = useAppSelector(selectCurrentDateId);
  const currentDatePositionIdx = useAppSelector(selectCurrentDatePositionIdx);
  const currentHabit = useAppSelector(selectCurrentHabit);
  
  const isMemoised = (dateId: number) =>
    selectHasStoredTreeForDateId(dateId)(store.getState())

  const handlePrevDate = (_: any) => {
    const currentFlash = document.querySelector('.flash-container')
    if(currentFlash) currentFlash.textContent = '' // Clear flash
    if (isVis) {
      dispatch(updateCurrentHierarchy({nextDateId: currentDateId - 1}))
      const newDateId = Math.max.apply(null, [1, currentDateId - 7]) // Account for minimum date Id

    if ( !isMemoised(newDateId)) {
      currentDatePositionIdx < 0 && updateCurrentHierarchy({nextDateId: -1}) // Account for boundary of possible stored habit tree jsons 
      currentDatePositionIdx == 3 && // Fetch the previous week when we are close to the start of the current week
      dispatch(fetchHabitTreesREST({ domainId: 1, dateId: newDateId - 3 }));
    }
}
    dispatch(decrementIdx())
}
  const handleNextDate = (_: any) => {
    const currentFlash = document.querySelector('.flash-container')
    if(currentFlash) currentFlash.textContent = '' // Clear flash

    const todaysDate = DateTime.now().startOf("day").ts;
    if (currentDate.timeframe.fromDate == todaysDate) return;
    
    if (isVis) {
      if (isMemoised(currentDateId + 1)) {
        dispatch(updateCurrentHierarchy({nextDateId: currentDateId + 1}))
      } else {
        dispatch(fetchHabitTreeREST({ domainId: 1, dateId: currentDateId + 1 }))
      }
    }
    dispatch(incrementIdx())
}

  const [responsiveNavOpen, setResponsiveNavOpen] = useState(false)
  let isDemo = false;
  return (
    <div
      className={
        isDemo
          ? "mask-wrapper bg-gray-600"
          : "mask-wrapper bg-balance-pshades-dark"
      }
    >
      <CalendarWidget handlePrev={debounce(handlePrevDate, 100)} handleNext={debounce(handleNextDate, 100)} hideMegaMenu={hideMegaMenu} showMegaMenu={showMegaMenu} scrollRef={scrollRef} />
      <header className={isDemo ? "bg-gray-600" : "bg-balance-pshades-dark"}>
        <div id="responsive-nav">
          <Link to="/">
            <span className="logo md:h-8 block h-10" tabIndex={1}>
              <svg
                id="logo"
                width="54"
                height="54"
                viewBox="0 0 54 54"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  tabIndex={0}
                  d="M15.34,45.5C8.26,45.5,2.5,39.74,2.5,32.66s5.76-12.84,12.84-12.84h1.31v8.37l-1.31,0c-2.47,0-4.47,2.01-4.47,4.47  c0,2.47,2.01,4.48,4.47,4.48c2.47,0,4.47-2.01,4.47-4.48l0-1.92v-15.4c0-7.08,5.76-12.84,12.84-12.84c7.08,0,12.84,5.76,12.84,12.84  s-5.76,12.84-12.84,12.84h-1.31v-8.37l1.31,0c2.47,0,4.47-2.01,4.47-4.47c0-2.47-2.01-4.47-4.47-4.47c-2.47,0-4.47,2.01-4.47,4.47  l0,1.92v15.4C28.18,39.74,22.42,45.5,15.34,45.5z"
                />
              </svg>
            </span>
          </Link>
          <div id="hamburger-wrapper">
            <div>
              <label
                id="hamburger-label"
                htmlFor="hamburger"
                className="text-balance-sshades-brighten border-1 lg:hidden md:w-6 md:h-6 block w-8 h-8"
                tabIndex={4}
              >
                <svg
                  className="text-balance-sshades-brighten stroke-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>
            <input type="checkbox" id="hamburger" className="hidden" ref={checkBoxRef} onClick={(e) => {
              setResponsiveNavOpen(checkBoxRef?.current.checked)
            }} />
            <nav className="wide-nav sm:top-18 shadow-tershades-gray max-w-1/2  translate-x-full">
              <div className="label-wrapper" >
                <div className="nav-label-primary domain-selector">
                  <span className="lg:hidden xl:block pt-2 pb-0 mx-4 mb-1">
                    <label>Domain</label>
                  </span>
                  <div className="lg:pr-0 lg:w-auto lg:rounded-3xl lg:rounded-t-none w-56 -mt-2 pl-1 pr-4 mr-2 bg-white rounded-full">
                    <span className="text-balance-sshades-brighten block w-full pt-2 mb-1">
                      <DomainSelector />
                    </span>
                  </div>
                </div>
                <div className="date-today nav-label-primary max-w-12">
                  <span className="lg:hidden xl:block md:pt-6 xl:pt-3 pt-0 pb-0 mx-4 mb-1 ml-6">
                    <label htmlFor="date-today">Date</label>
                  </span>
                  <div className="lg:pr-0 lg:rounded-3xl lg:rounded-t-none xl:-mt-3 rounded-3xl xl:w-56 -mt-2 bg-white">
                    <span className="lg:pt-2 text-balance-sshades-brighten flex justify-around w-full -mt-3 mb-1">
                      <i
                        id="prev-date-selector"
                        className="fa fa-chevron-circle-left pt-2 pr-2"
                        aria-hidden="true"
                        onClick={debounce(handlePrevDate, 50)}
                      />
                      <DateSelector />
                      <i
                        id="next-date-selector"
                        className="fa fa-chevron-circle-right pt-2"
                        aria-hidden="true"
                        onClick={debounce(handleNextDate, 50)}
                      />
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="lg:block sm:w-3/5 lg:border-none lg:w-auto lg:mt-1 text-md md:px-0 lg:flex-row flex-wrap items-center justify-around hidden px-4 py-1 mt-3 mr-3">
                <div className="user-avatar lg:border-1">
                  <img
                    className="lg:border-1 lg:border-balance-tershades-gray lg:rounded-3xl lg:rounded-t-none border-1 border-balance-tershades-light flex flex-none object-cover w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1597020642626-3c9b687eba70?ixid=MXwxMjA3fDB8MXxzZWFyY2h8MXx8bWFuJ3MlMjBmYWNlfHwwfHx8&ixlib=rb-1.2.1&dpr=1&auto=format&fit=crop&w=120&h=200&q=60"
                    alt="profile picture"
                  />
                  <span className="user-nav-label lg:text-gray-100 sm:px-0 lg:ml-0 lg:mr-4 lg:mb-1 lg:px-0 flex px-2 mx-4 font-light">
                    <span>Bob</span>
                  </span>
                </div>
                <div className="lg:hidden flex flex-col px-4 font-bold tracking-wide">
                  <button className="active:outline hover:text-balance-pshades-light text-tershades-gray px-4 py-2 mt-2 font-sans font-semibold text-center uppercase">
                    Account Details
                  </button>
                  <button className="active:outline hover:text-balance-pshades-light text-tershades-gray px-4 py-2 mt-2 font-sans font-semibold text-center uppercase">
                    Logout
                  </button>
                </div>
              </div> */}
              <ul className="nav-groups  justify-end lg:hidden rounded-t-r-3xl flex flex-col-reverse w-full mb-8 ">
                {MENU_ROUTES.map(({ label, subpaths }: any, idx: number) => (
                  <ResponsiveNavGroup
                    key={idx}
                    id={`nav-${label.toLowerCase()}`}
                    classString={
                      MENU_ROUTE_FIRST_SELECTED === label ? "active" : ""
                    }
                    label={label}
                    subpaths={subpaths}
                  />
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <nav id="subnav">
          <DropdownNav routes={MENU_ROUTES} hideMegaMenu={hideMegaMenu} showMegaMenu={showMegaMenu} />
        </nav>
      </header>
      <div
        className={
          isDemo
            ? "px-0.5 -ml-2 -mt-4 max-h-14 bg-gray-600 lg:hidden text-gray-50 flex items-baseline justify-center leading-8 sm:leading-7 pb-16 border-b-4 relative"
            : "px-0.5 -ml-2 -mt-4 max-h-14 bg-balance-pshades-dark lg:hidden text-gray-50 flex items-baseline leading-8 sm:leading-7 pb-16 border-b-4 md:leading-6 relative"
        }
        id="current-habit-label-sm"
      >
        <span id="current-habit-sm" className="md:block block py-0 pr-2 ml-3">
          HABIT
        </span>
        <div className="max-h-12 md:block sm:hidden block overflow-auto">
          {currentHabit.meta.name}
        </div>
        <i className="down-btn w-12 h-12" onClick={executeScroll} hidden={responsiveNavOpen} />
      </div>
    </div>
  );
};
