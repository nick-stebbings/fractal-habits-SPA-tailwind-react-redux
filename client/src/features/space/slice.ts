import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dictionary, TimeFrame } from "app/types";
import { RootState } from "app/store";

import { weekOfDaySpaces, daySpace } from "app/utils";

export const getThisWeekSpaces = (state: RootState) => {
  return state?.space.thisWeek;
};
export const getLastWeekSpaces = (state: RootState) => {
  return state?.space.lastWeek;
};

export interface Space {
  timeframe: TimeFrame;
}

// export interface NewSpacePayload {
//   spaceId: string;
//   space: Space;
// }

// export interface DeleteSpacePayload {
//   spaceId: string;
// }

// export interface UpdateSpacePayload {
//   spaceId: string;
//   spacePatch: Partial<Space>;
// }

export const initialState: Dictionary<Space[]> = {
  thisWeek: weekOfDaySpaces(),
  lastWeek: weekOfDaySpaces(-7),
  current: daySpace(),
};

export const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {},
});

export default spaceSlice;
