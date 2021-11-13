import { RootState } from "app/store";

export const getCurrentList = (state: RootState) => {
  return state?.todo?.currentList;
};
