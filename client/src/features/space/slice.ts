import { createSelector, createSlice } from "@reduxjs/toolkit";

import { DB_DATE_ID_OFFSET } from "app/constants";

import { Dictionary, TimeFrame } from "app/types";

import { RootState } from "app/store";

import { weekOfDaySpaces, createInterval } from "./helpers";
import { DateTime } from "luxon";

export const selectThisWeekSpaces = (state: RootState) => state?.space.thisWeek;

export const selectLastWeekSpaces = (state: RootState) => state?.space.lastWeek;

export const selectCurrentSpace = (state: RootState) => state?.space.current;

export const selectCurrentDatePositionIdx = (state: RootState) =>
  state?.space.currentIdx;

export const selectCurrentDate = (state: RootState) => state?.space.current;

export const selectCurrentDateId = (state: RootState) => {
  let baseDate = DateTime.fromISO("2021-12-03").startOf("day"); // Hard coded for the demo app. There is no date model but there is in the API until it is phased out.
  let dateDiff = DateTime.local()
    .startOf("day")
    .diff(baseDate, ["day"])
    .toObject().days;
  return state?.space.currentRelativeIdx - 1 + DB_DATE_ID_OFFSET + dateDiff;
};

export const selectRelativeDateId = (fromDateTimestampUnix: number) =>
  createSelector(
    [selectCurrentDateId, selectCurrentSpace],
    (dateIdNow, currentSpace) => {
      let dateDiff = DateTime.fromMillis(fromDateTimestampUnix)
        .diff(DateTime.fromMillis(currentSpace.timeframe.fromDate), ["day"])
        .toObject().days;
      return dateDiff + dateIdNow;
    }
  );

export interface Space {
  timeframe: TimeFrame;
}

export const initialState: Dictionary<Space[] | number> = {
  thisWeek: weekOfDaySpaces(0),
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
        state.nextWeek = [...state.thisWeek];
        state.thisWeek = [...state.lastWeek];
        state.lastWeek = weekOfDaySpaces(state.currentRelativeIdx - 6);

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
      let newIdx = state.currentIdx + 1;
      if (newIdx % 7 == 0) {
        // Move each week of spaces backwards
        state.lastWeek = [...state.thisWeek];
        state.thisWeek = [...state.nextWeek];
        // Update indices
        state.currentRelativeIdx += 1;
        state.currentIdx = 0;
        // Create next week from the following day
        state.nextWeek = weekOfDaySpaces(state.currentRelativeIdx + 15);
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
