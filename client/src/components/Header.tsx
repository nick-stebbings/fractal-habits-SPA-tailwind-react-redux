import React from "react";
import { Link } from "react-router-dom";

import { CalendarWidget } from "features/habitDate/components/CalendarWidget";
// import ResponsiveNavGroup from "../Nav/ResponsiveNavGroup.jsx";
// import DomainSelector from "./UI/Inputs/DomainSelector.jsx";
// import DropdownNav from "../Nav/DropdownNav.jsx";
// import DateSelector from "../Nav/UI/Inputs/DateSelector.jsx";

import "../assets/styles/components/MaskHeader.scss";

export const Header = () => {
  let isDemo = true;
  return (
    <>
      <div
        className={
          isDemo
            ? "mask-wrapper bg-gray-600"
            : "mask-wrapper bg-balance-pshades-dark"
        }
      >
        <CalendarWidget />
        <header className={isDemo ? "bg-gray-600" : "bg-balance-pshades-dark"}>
          <div
            id="responsive-nav"
            className="sm:h-12 lg:px-0 lg:justify-end flex items-center justify-between h-16"
          >
            <Link
              to="/"
              // selector="span"
              // tabindex={1}
              // className="logo md:h-8 block h-10"
            >
              <svg
                id="logo"
                className="hover:text-gray-100 md:ml-1 w-10 h-10 text-gray-100 fill-current stroke-current"
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
            </Link>
            <div
              id="hamburger-wrapper"
              className="md:h-8 lg:flex-auto flex h-10"
            >
              <div className="active:outline-light focus:outline-light hover:bg-gray-700 md:w-8 md:h-8 flex items-center justify-center w-10 h-10 rounded-md">
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
              <input type="checkbox" id="hamburger" className="hidden" />
              <nav className="top-16 sm:top-18 md:top-24 lg:-mt-4 lg:border-balance-tershades-gray bg-balance-tershades-gray lg:border-0 md:top-12 lg:flex lg:justify-end lg:items-center lg:static lg:flex-row lg:bg-transparent sm:flex-row sm:flex-wrap lg:flex-nowrap shadow-tershades-gray max-w-1/2 absolute left-0 z-20 flex-col hidden w-full border-b-4">
                <div className="md:pl-1 6 sm:pl-24 sm:my-2 sm:w-2/5 lg:w-auto lg:p-0 lg:border-0 lg:flex lg:flex-1 lg:justify-end lg:flex-row-reverse flex flex-col content-center justify-between hidden px-4 pt-1 pb-2">
                  <div className="nav-label-primary bg-gradient-to-l sm:flex-col lg:flex-row max-w-12 from-balance-tershades-desat to-balance-tershades-gray lg:rounded-3xl lg:rounded-t-none lg:-mt-3 lg:mr-2 flex items-center justify-between mt-2 text-sm text-black rounded-full">
                    <span className="lg:hidden xl:block pt-2 pb-0 mx-4 mb-1">
                      <label>Domain</label>
                    </span>
                    <div className="lg:pr-0 lg:rounded-3xl lg:rounded-t-none w-56 h-full pl-1 pr-4 mr-2 bg-white rounded-full">
                      <span className="text-balance-sshades-brighten block w-full pt-2 mb-1">
                        {/* <DomainSelector></DomainSelector> */}
                      </span>
                    </div>
                  </div>
                  <div className="date-today nav-label-primary bg-gradient-to-l sm:flex-col lg:flex-row border-balance-pshades-dark max-w-12 from-balance-tershades-desat to-balance-tershades-gray lg:rounded-t-none lg:-mt-3 lg:mr-2 rounded-3xl flex items-center justify-between pr-2 mt-2 text-sm text-black">
                    <span className="lg:hidden xl:block md:pt-6 xl:pt-3 pt-0 pb-0 mx-4 mb-1 ml-6">
                      <label htmlFor="date-today">Date</label>
                    </span>
                    <div className="lg:pr-0 lg:w-auto lg:rounded-3xl lg:rounded-t-none xl:-mt-3 rounded-3xl w-56 h-full bg-white">
                      <span className="lg:pt-2 text-balance-sshades-brighten flex justify-around block w-full mb-1">
                        {`HabitStore.current()?.initiation_date && <i
                            id="prev-date-selector"
                            className="fa fa-chevron-circle-left pt-2 pr-2"
                            aria-hidden="true"
                          />`}
                        {/* <DateSelector></DateSelector> */}
                        <i
                          id="next-date-selector"
                          className="fa fa-chevron-circle-right pt-2"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:block sm:w-3/5 lg:border-none lg:w-auto lg:mt-1 text-md md:px-0 lg:flex-row flex flex-wrap items-center justify-around hidden px-4 py-1 mt-3 mr-3">
                  <div className=" xl:block lg:border-1 border-balance-tershades-gray lg:flex-row-reverse bg-balance-tershades-light lg:bg-gray-700 lg:py-0 lg:rounded-3xl lg:rounded-t-none flex-nowrap flex items-center justify-between hidden py-2 pl-4 mr-1 border-2 rounded-full">
                    <img
                      className="lg:border-1 lg:border-balance-tershades-gray lg:rounded-3xl lg:rounded-t-none border-1 border-balance-tershades-light flex flex-none object-cover w-10 h-10 rounded-full"
                      src="https://images.unsplash.com/photo-1597020642626-3c9b687eba70?ixid=MXwxMjA3fDB8MXxzZWFyY2h8MXx8bWFuJ3MlMjBmYWNlfHwwfHx8&ixlib=rb-1.2.1&dpr=1&auto=format&fit=crop&w=120&h=200&q=60"
                      alt=""
                    />
                    <span className="user-nav-label lg:text-gray-100 sm:px-0 lg:ml-0 lg:mr-4 lg:mb-1 lg:px-0 flex block px-2 mx-4 font-light">
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
                </div>
                <ul className="lg:hidden flex flex-col-reverse w-full mb-8">
                  {/* {MenuRoutes.map((route) => (
                      <ResponsiveNavGroup
                        id={`nav-${route.label.toLowerCase()}`}
                        class={
                          MenuRoutes.selected === route.label
                            ? "active"
                            : ""
                        }
                        label={route.label}
                        url={`${route.path}`}
                      >
                        {route.subpaths}
                      </ResponsiveNavGroup>
                    ))} */}
                </ul>
              </nav>
            </div>
          </div>
          <nav id="subnav">{/* <DropdownNav routes={MenuRoutes} /> */}</nav>
        </header>
        <div
          className={
            isDemo
              ? "px-0.5 -ml-2 -mt-4 max-h-14 bg-gray-600 lg:hidden text-gray-50 flex items-baseline justify-center leading-8 sm:leading-7 pb-16"
              : "px-0.5 -ml-2 -mt-4 max-h-14 bg-balance-pshades-dark lg:hidden text-gray-50 flex items-baseline leading-8 sm:leading-7 pb-16 md:leading-6"
          }
          id="current-habit-label-sm"
        >
          <span
            id="current-habit-sm"
            className="block sm:hidden md:block ml-3 pr-2 py-0"
          >
            HABIT
          </span>
          <div className="block max-h-12 md:block overflow-auto sm:hidden">
            {/* {HabitStore.current()?.name} */}
          </div>
        </div>
      </div>
    </>
  );
};
