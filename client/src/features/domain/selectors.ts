// @ts-ignore
import { RootState } from "app/store";

export const getCurrentDomain = (state: RootState) => {
  return state?.domain?.current;
};
