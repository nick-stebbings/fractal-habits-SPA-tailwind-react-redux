// @ts-ignore
import { RootState } from "app/store";

export const getCurrentHabit = (state: RootState) => {
  return state?.habit?.current;
};
