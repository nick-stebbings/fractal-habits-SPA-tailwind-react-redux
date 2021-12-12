// @ts-ignore
import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
import { selectCurrentNodeByMptt } from "../node/selectors";
import { Habit } from "./types";
import { Node } from "../node/types";

export const selectCurrentHabit = (state: RootState): Habit => {
  return state?.habit?.current;
};

export const selectStoredHabits = (state: RootState): Habit[] => {
  return state?.habit?.myRecords;
};

export const selectCurrentHabitByMptt = (
  state: RootState,
  lft: number,
  rgt: number
): Habit => {
  console.log(
    "object :>> ",
    selectStoredHabits(state),
    selectStoredHabits(state).filter(
      (h: Habit) =>
        h.meta.habitNodeId === selectCurrentNodeByMptt(state, lft, rgt)?.id
    )[0]
  );
  return selectStoredHabits(state).filter(
    (h: Habit) =>
      h.meta.habitNodeId === selectCurrentNodeByMptt(state, lft, rgt)?.id
  )[0];
};
