import { createSlice, createSelector } from "@reduxjs/toolkit";
import { Dictionary, TimeFrame } from "app/types";
import { RootState } from "app/store";

import { weekOfDaySpaces, daySpace } from "app/utils";

export const getThisWeekSpaces = createSelector((state: RootState) => {
  return state?.space.thisWeek;
});

export const getLastWeekSpaces = createSelector((state: RootState) => {
  return state?.space.lastWeek;
});

export const getCurrentSpace = createSelector((state: RootState) => {
  return state?.space.current;
});

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
