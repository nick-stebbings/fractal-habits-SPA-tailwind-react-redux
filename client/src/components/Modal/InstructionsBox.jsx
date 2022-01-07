import React from "react";
import expandBtn from "/images/icons/expand-btn.png";
import divideBtn from "/images/icons/divide-btn.png";
import downHandBtn from "/images/icons/hide-menu-btn.png";
import resetViewBtn from "/images/icons/reset-view-btn.png";
import habitChain from "/images/icons/habit-chain.png";
import swipeZone from "/images/icons/swipe-zone.png";

import { CancelButton } from "../Nav/UI/Buttons/CancelButton";
import { isTouchDevice, isSmallScreen, isSuperSmallScreen } from "app/helpers";

const getScaleForScreenSize = () => {
  if (isSuperSmallScreen()) {
    return 0.65;
  } else if (isSmallScreen()) {
    return 0.8;
  } else {
    return 1;
  }
};

export const InstructBox = ({
  title,
  message,
  type,
  iconPath,
  iconColor,
  handleClose,
}) => {
  return (
    <>
      <div className="sm:m-8 flex items-center m-4">
        <div className="form-header mx-2 md:mx-12 w-14 h-14 bg-balance-tershades-gray flex items-center justify-center flex-shrink-0 font-mono rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className={iconColor}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={iconPath}
            />
          </svg>
        </div>
        <form id="form-dialog" className="p-0">
          <div className="self-start block pl-2 text-xl font-semibold text-gray-700">
            <p className="text-sm font-normal leading-relaxed text-gray-500">
              {message}
            </p>
          </div>
          <div
            className="button-group py-3 mr-4 -mb-12- text-sm bg-transparent"
            style={{ top: "0px" }}
          >
            <CancelButton
              id={`close-modal-instructions`}
              name="close"
              label="Close"
              type={"small"}
              handleClose={handleClose}
            />
          </div>
        </form>
      </div>
      <div className="instructions w-full h-full flex flex-col overflow-auto bg-balance-basic-dark border-2 gap-y-4">
        <div className="p-8 mx-2 text-lg leading-relaxed text-justify">
          <h1 className="text-center mt-2">
            The aim of the game is to make a chain
          </h1>
          <p className="mt-2">
            Pick a life habit that you would like to build. It can be as broad
            or as specific in scope as you like. This proof of concept is set to
            build habits in the domain of Physical Health.
          </p>
          <img src={habitChain} className="mt-2 mx-auto" />
          <p className="mt-2">
            Once you have a habit structure, you can mark it as Complete or
            Incomplete for any given day. We'll get into that in more depth
            shortly.
          </p>
          <hr className="mt-4 mb-8 w-8 mx-auto" />

          <h1 className="text-center mt-2">Build Up or Drill Down</h1>
          <p className="mt-2">
            Once you have a habit, you can decide to broaden (expand) or break
            down (divide) the habit. If you keep dividing and dividing,
            eventually you will have a simple list of instructions - one that's
            visually satisfying to tick off.
          </p>
          <p className="mt-2 w-1/2 mx-auto text-center">
            Look for these buttons:
          </p>
          <div className="flex items-center justify-center">
            <img src={expandBtn} />
            <img src={divideBtn} />
          </div>
          <hr className="mt-4 mb-8 w-8 mx-auto" />

          <h1 className="text-center mt-2">Drop what doesn't serve you</h1>
          <p className="mt-2">
            You can remove a habit by clicking the button shown below.
          </p>
          <div className="flex justify-center" style={{ color: "#e06a58" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="mt-2">
            Be careful - if you delete a habit, you also delete all of its
            fractions (sub-habits)! You also delete the habit historically when
            you confirm this action.
          </p>
          <hr className="mt-4 mb-8 w-8 mx-auto" />

          <h1 className="text-center mt-2">
            Select a habit to enter Focused Mode
          </h1>
          <p className="mt-2">
            You can zoom in/out manually in the usual way, but to quickly view a
            habit close-up, just
            <span className="uppercase text-xl bg-balance-tershades-light pr-2 ml-2 mr-1">
              {isTouchDevice() ? " tap" : " click"}
            </span>{" "}
            on that habit's circle.
          </p>
          <p className="mt-2">
            Sometimes there just isn't enough screen-space... especially in
            Focused Mode. Try to zoom out/move away manually and you will return
            to a scaled out view.
          </p>
          <hr className="mt-4 mb-8 w-8 mx-auto" />
          {isTouchDevice() && (
            <>
              <p className="mt-2">
                If you want to hide the menu and dashboard from view, click the
                downward pointing hand. It will give you a little more space.
                <img className="mx-auto" src={downHandBtn} />
              </p>
              <p className="mt-2">
                In order to bring it back into view, click the Reset View
                button. This also resets the zoom and centres the visualisation.
                <img className="mx-auto" src={resetViewBtn} />
              </p>
              <hr className="mt-4 mb-8 w-8 mx-auto" />
            </>
          )}

          <h1 className="text-center mt-2">Toggle to your heart's content</h1>
          <p className="mt-2">
            To change the status of a given habit on a given day just
            <span className="uppercase text-xl bg-balance-tershades-light pr-2 ml-2 mr-1">
              {isTouchDevice() ? " double tap" : " right click"}
            </span>{" "}
            on that habit's circle. It will change colour when it changes state
            - and so will the habits above it in the hierarchy.
          </p>
          <hr className="mt-4 mb-8 w-8 mx-auto" />

          <p className="mt-2 mb-8">
            If you want to mark a higher-level habit as completed for a day, you
            need to toggle the completion of its sub-habits. Here is a more
            detailed explanation of what the colours mean{" "}
            {isSuperSmallScreen() && "(scroll to view)"} :
          </p>
          <svg
            className="instruct-legend flex"
            style={{ width: isSmallScreen() ? "170%" : "100%" }}
          >
            <g
              className="legend"
              transform={`scale(${getScaleForScreenSize()}) translate(0, 20)`}
            >
              <g className="legendCells">
                <g className="cell" transform="translate(25, 0)">
                  <circle
                    className="swatch"
                    r="20"
                    style={{ fill: "rgb(147, 204, 150)" }}
                  ></circle>
                  <text transform="translate(30, 5) scale(0.8)">
                    This habit, and ALL sub-habits, are marked complete.
                  </text>
                </g>
                <g className="cell" transform="translate(25, 23)">
                  <circle
                    className="swatch"
                    r="20"
                    style={{ fill: "rgb(242, 170, 83)" }}
                  ></circle>
                  <text transform="translate(30, 5) scale(0.8)">
                    This habit, and ALL sub-habits, are marked incomplete.
                  </text>
                </g>
                <g className="cell" transform="translate(25, 46)">
                  <circle
                    className="swatch"
                    r="17"
                    style={{ fill: "rgb(237, 216, 55)" }}
                  ></circle>
                  <text transform="translate(30, 5) scale(0.8)">
                    This habit is part-complete. It was divided and some
                    sub-habits are incomplete.
                  </text>
                </g>
                {/* <g className="cell" transform="translate(25, 69)">
                  <circle
                    className="swatch"
                    r="20"
                    style={{ fill: "rgb(218, 222, 205)" }}
                  ></circle>
                  <text
                    className="label"
                    transform="translate(30, 5) scale(0.8)"
                  >
                    This habit is in-bounds but we haven't started tracking it
                    yet.
                  </text>
                </g> */}
                <g className="cell" transform="translate(25, 69)">
                  <circle
                    className="swatch"
                    r="20"
                    style={{ fill: "rgb(136, 136, 136)" }}
                  ></circle>
                  <text
                    className="label"
                    transform="translate(30, 5) scale(0.8)"
                  >
                    There is no data for this habit on this day. It didn't exist
                    then.
                  </text>
                </g>
              </g>
            </g>
          </svg>

          {isTouchDevice() && (
            <>
              <hr className="mt-4 mb-8 w-8 mx-auto" />
              <h1 className="text-center mt-2">Swipe to Move in Time</h1>
              <p className="mt-2">
                There's a lot of zooming and panning going on here -- But
                there's always room for swiping: below the SWIPE ZONE text,
                specifically!
                <img className="mx-auto my-2" src={swipeZone} />
              </p>
              <p className="mt-4 mb-64">
                You can{" "}
                <span className="uppercase text-xl bg-balance-tershades-light pr-2 ml-2 mr-1">
                  swipe left
                </span>{" "}
                to go back a day and{" "}
                <span className="uppercase text-xl bg-balance-tershades-light pr-2 ml-2 mr-1">
                  swipe right
                </span>{" "}
                to go forwards a day, but try to do it in the greyed out area.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};
