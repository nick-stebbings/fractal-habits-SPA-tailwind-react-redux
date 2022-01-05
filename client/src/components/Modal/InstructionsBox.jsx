import React from "react";
import expandBtn from "/images/icons/expand-btn.png";
import divideBtn from "/images/icons/divide-btn.png";

import { CancelButton } from "../Nav/UI/Buttons/CancelButton";

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
        <div className="form-header mx-12 w-14 h-14 bg-balance-tershades-gray flex items-center justify-center flex-shrink-0 font-mono rounded-full">
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
          <div className="button-group py-3 mb-2 mr-4 text-sm bg-white border-t border-gray-200">
            <CancelButton
              id={`close-modal-instructions`}
              name="close"
              label="Close"
              type={type}
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
          <p className="mt-2">
            Once you have a habit structure, you can mark it as Complete or
            Incomplete for any given day. We'll get into that in more depth
            shortly.
          </p>
          <hr className="mt-4 mb-8 w-8 mx-auto" />

          <h1 className="text-center mt-2">Build Up or Drill Down</h1>
          <p className="mt-2">
            Once you have a habit, you can decide to broaden (expand) or break
            down (divide) the habit.
          </p>
          <p className="mt-2 w-1/2 mx-auto text-center">
            Look for these buttons:
            <div className="flex items-center justify-center">
              <img src={expandBtn} />
              <img src={divideBtn} />
            </div>
          </p>
          <hr className="mt-4 mb-8 w-8 mx-auto" />

          <h1 className="text-center mt-2">Drop what doesn't serve you</h1>

          <p className="mt-2">
            You can remove a habit by clicking the button shown below. Be
            careful, as if you delete a habit, you also delete all of its
            dividends (sub-habits)! You also delete the habit historically when
            you confirm this action.
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
          <hr className="mt-4 mb-8 w-8 mx-auto" />
          <p className="mt-2">
            Pick a habit that you would like to build. It can be as broad or as
            specific in scope as you like. This proof of concept is set to build
            habits in the domain of Physical Health.
          </p>
          <hr className="mt-4 mb-8 w-8 mx-auto" />
          <p className="mt-2">
            Pick a habit that you would like to build. It can be as broad or as
            specific in scope as you like. This proof of concept is set to build
            habits in the domain of Physical Health.
          </p>
        </div>
        <svg className="instruct-legend flex">
          <g className="legend" transform="scale(1.5)">
            <g className="legendCells">
              <g className="cell" transform="translate(0, 0)">
                <circle
                  className="swatch"
                  r="14"
                  style={{ fill: "rgb(147, 204, 150)" }}
                ></circle>
                <text className="label" transform="translate( 24, 5)">
                  Completed
                </text>
              </g>
              <g className="cell" transform="translate(0, 23)">
                <circle
                  className="swatch"
                  r="14"
                  style={{ fill: "rgb(242, 170, 83)" }}
                ></circle>
                <text className="label" transform="translate( 24, 5)">
                  Incomplete
                </text>
              </g>
              <g className="cell" transform="translate(0, 46)">
                <circle
                  className="swatch"
                  r="14"
                  style={{ fill: "rgb(237, 216, 55)" }}
                ></circle>
                <text className="label" transform="translate( 24, 5)">
                  Sub-Incomplete
                </text>
              </g>
              <g className="cell" transform="translate(0, 69)">
                <circle
                  className="swatch"
                  r="14"
                  style={{ fill: "rgb(218, 222, 205)" }}
                ></circle>
                <text className="label" transform="translate( 24, 5)">
                  Not Yet Tracked
                </text>
              </g>
              <g className="cell" transform="translate(0, 92)">
                <circle
                  className="swatch"
                  r="14"
                  style={{ fill: "rgb(136, 136, 136)" }}
                ></circle>
                <text className="label" transform="translate( 24, 5)">
                  Out of Bounds
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </>
  );
};
