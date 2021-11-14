// @ts-ignore
import { RootState } from "app/store";

export const selectCurrentDomain = (state: RootState) => {
  return state?.domain?.current;
};

export const selectStoredDomains = (state: RootState) => {
  return state?.domain?.myRecords;
};
