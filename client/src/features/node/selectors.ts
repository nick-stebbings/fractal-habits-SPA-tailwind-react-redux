// @ts-ignore
import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";

// @ts-ignore
import { Node } from "app/features/node/types";

export const selectCurrentNode = (state: RootState) => {
  return state?.node?.current;
};

export const selectStoredNodes = (state: RootState) => {
  return state?.node?.myRecords;
};

export const selectCurrentNodes = (state: RootState) => {
  return state?.node?.myRecords.filter((record: Node) => {});
};

// export const selectIsCompletedDate = (fromDateUnixTs: number) => {
//   return createSelector(
//     [selectStoredNodes],
//     (dates) =>
//       dates &&
//       dates.some(
//         ({ timeframe }: TimeFrame) => timeframe.fromDate == fromDateUnixTs
//       )
//   );
// };
