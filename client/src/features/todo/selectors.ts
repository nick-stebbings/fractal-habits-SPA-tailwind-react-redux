import { RootState } from "app/store";

export const selectCurrentList = (state: RootState) => {
  return state?.todo?.currentList;
};
