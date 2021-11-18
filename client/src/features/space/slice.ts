import { createSlice, createSelector } from "@reduxjs/toolkit";

// @ts-ignore
import { Dictionary, TimeFrame } from "app/types";

// @ts-ignore
import { RootState } from "app/store";

// @ts-ignore
import { weekOfDaySpaces, createInterval } from "./utils";

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
  current: createInterval(),
  currentIdx: 0,
};

export const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {
    decrementIdx(state) {
      let newIdx = state.currentIdx - 1;
      // is new idx < 0, > 6?
      if (newIdx < 0) {
      } else {
        state.currentIdx = newIdx;
      }
    },
    incrementIdx(state) {
      let newIdx = state.currentIdx + 1;
      if (newIdx > 6) {
        // is new idx > 6?
        // THEN
      } else {
        state.currentIdx = newIdx;
      }
    },
  },
});

export default spaceSlice;
