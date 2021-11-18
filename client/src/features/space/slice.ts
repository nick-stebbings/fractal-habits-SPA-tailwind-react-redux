import { createSlice, createSelector } from "@reduxjs/toolkit";

// @ts-ignore
import { Dictionary, TimeFrame } from "app/types";

// @ts-ignore
import { RootState } from "app/store";

// @ts-ignore
import { weekOfDaySpaces, createInterval } from "./utils";
import { DateTime } from "luxon";

export const selectThisWeekSpaces = (state: RootState) => {
  return state?.space.thisWeek;
};

export const selectLastWeekSpaces = (state: RootState) => {
  return state?.space.lastWeek;
};

export const selectCurrentSpace = (state: RootState) => {
  return state?.space.current;
};
export const selectCurrentSpaceIndex = (state: RootState) => {
  return state?.space.currentIdx;
};

export interface Space {
  timeframe: TimeFrame;
}

export const initialState: Dictionary<Space[]> = {
  thisWeek: weekOfDaySpaces(),
  lastWeek: weekOfDaySpaces(-7),
  nextWeek: weekOfDaySpaces(7),
  current: createInterval(),
  currentIdx: 6,
  currentRelativeIdx: -1,
};

export const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {
    decrementIdx(state) {
      let newIdx = state.currentIdx - 1;
      // is new idx < 0, > 6?
      // THEN make last week current week,
      // make a new last week of spaces.
      // make current week next week
      if (newIdx % 7 < 0) {
        // Move each week of spaces forwards
        state.nextWeek = state.thisWeek;
        state.thisWeek = state.lastWeek;
        state.lastWeek = weekOfDaySpaces(state.currentRelativeIdx - 7);

        // Update indices
        state.currentRelativeIdx -= 1;
        state.currentIdx = 6;
        // Update position in current week
        state.current = state.thisWeek[state.currentIdx];
      } else {
        state.currentRelativeIdx -= 1;
        state.currentIdx = newIdx;
        state.current = state.thisWeek[newIdx % 7];
      }
    },
    incrementIdx(state) {
      const todaysDate = DateTime.now().startOf("day").ts;
      let future = state.current.timeframe.fromDate == todaysDate;
      if (future) return state;

      let newIdx = state.currentIdx + 1;
      if (newIdx % 7 == 0) {
        // Move each week of spaces backwards
        state.lastWeek = state.thisWeek;
        state.thisWeek = state.nextWeek;

        // Update indices
        state.currentRelativeIdx += 1;
        state.currentIdx = 0;
        // Update position in current week
        state.current = state.thisWeek[state.currentIdx];
      } else {
        state.currentRelativeIdx += 1;
        state.currentIdx = newIdx;
        state.current = state.thisWeek[newIdx % 7];
      }
    },
  },
});

export default spaceSlice;
