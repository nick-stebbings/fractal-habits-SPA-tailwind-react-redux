import { createSlice, createSelector } from "@reduxjs/toolkit";

// @ts-ignore
import { Dictionary, TimeFrame } from "app/types";

// @ts-ignore
import { RootState } from "app/store";

// @ts-ignore
import { weekOfDaySpaces, daySpace } from "./utils";

export const selectThisWeekSpaces = (state: RootState) => {
  return state?.space.thisWeek;
};

export const selectLastWeekSpaces = (state: RootState) => {
  return state?.space.lastWeek;
};

export const selectCurrentSpace = (state: RootState) => {
  return state?.space.current;
};

export interface Space {
  timeframe: TimeFrame;
}

export const initialState: Dictionary<Space[]> = {
  thisWeek: weekOfDaySpaces(),
  lastWeek: weekOfDaySpaces(-7),
  current: daySpace(),
};

export const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {},
});

export default spaceSlice;
