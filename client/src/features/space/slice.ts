import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dictionary, TimeFrame } from "app/types";
import { RootState } from "app/store";

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
// import merge from "deepmerge";
import * as luxon from "luxon";

const daySpace = (startRelative = 0, numberOfDays = 1) => ({
  // startRelative is days relative to present (negative)
  timeframe: {
    fromDate:
      luxon.DateTime.local().startOf("day") -
      luxon.Duration.fromObject({ days: -startRelative }),
    toDate:
      luxon.DateTime.local().startOf("day") +
      luxon.Duration.fromObject({ days: startRelative + numberOfDays }),
    length: luxon.Duration.fromObject({ days: numberOfDays }).toString(),
  },
});

const weekOfDaySpaces = (startRelative = 0) =>
  Array.from("1234567")
    .map((_, idx) => daySpace(startRelative - idx, 1))
    .reverse();

export const initialState: Dictionary<Space[]> = {
  thisWeek: weekOfDaySpaces(),
  lastWeek: weekOfDaySpaces(-7),
};

export const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {},
});

export default spaceSlice;
