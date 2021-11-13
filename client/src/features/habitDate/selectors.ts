import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
import { stringifyDate } from "app/utils";
import { TimeFrame } from "app/types";
import { Habit } from "app/features/habit/types";

export const getMyHabitDates = (state: RootState) => {
  return state?.habit?.myRecords;
};

export const getCurrentHabitDates = (state: RootState) => {
  return state?.habit?.myRecords.filter((record: Habit) => {});
};

export const selectIsCompletedDate = (fromDateUnixTs: number) => {
  return createSelector(getMyHabitDates, (dates) =>
    dates.includes((record: TimeFrame) => record.fromDate == fromDateUnixTs)
  );
};
