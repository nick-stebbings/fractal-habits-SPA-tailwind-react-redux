import { RootState } from "app/store";

export const getMyHabitDates = (state: RootState) => {
  return state?.habit?.myRecords;
};
