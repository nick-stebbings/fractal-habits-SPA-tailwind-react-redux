import { RootState } from "app/store";

export const selectCurrentDomain = (state: RootState) => {
  return state?.domain?.current;
};

export const selectStoredDomains = (state: RootState) => {
  return state?.domain?.myRecords;
};

export const selectCurrentDomainIndex = (state: RootState) => {
  return state?.domain?.currentIndex;
};
