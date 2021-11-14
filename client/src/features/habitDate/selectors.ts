import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
import { stringifyDate } from "features/habitDate/utils";
import { TimeFrame } from "app/types";
import { Habit } from "app/features/habit/types";

export const selectStoredHabitDates = (state: RootState) => {
  return state?.habitDate?.myRecords;
};

export const selectCurrentHabitDates = (state: RootState) => {
  return state?.habitDate?.myRecords.filter((record: Habit) => {
    debugger;
  });
};

export const selectIsCompletedDate = (fromDateUnixTs: number) => {
  return createSelector(
    selectStoredHabitDates,
    (dates) =>
      dates &&
      dates.some(
        ({ timeframe }: TimeFrame) => timeframe.fromDate == fromDateUnixTs
      )
  );
};
