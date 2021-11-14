// @ts-ignore
import { RootState } from "app/store";

export const selectCurrentHabit = (state: RootState) => {
  return state?.habit?.current;
};

export const selectStoredHabits = (state: RootState) => {
  return state?.habit?.myRecords;
};
