// @ts-ignore
import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
// @ts-ignore
import { hierarchy } from "d3-hierarchy";
// @ts-ignore
import { TimeFrame } from "app/types";
// @ts-ignore
import { Habit } from "app/features/habit/types";
import { selectCurrentHierarchy } from "../hierarchy/selectors";
import { selectCurrentHabit } from "../habit/selectors";
import { parseTreeValues } from "../hierarchy/components/helpers";

export const selectStoredHabitDates = (state: RootState) => {
  return state?.habitDate?.myRecords;
};

export const selectCurrentHabitDate = (state: RootState) => {
  return state?.habitDate?.current;
};
export const selectCurrentHabitDates = (state: RootState) => {
  return state?.habitDate?.myRecords.filter((record: Habit) => {});
};

export const selectIsCompletedDate = (
  fromDateUnixTs: number,
  dates: any,
  hierarchyData: any,
  currentHabit: any
) => {
  const dateIsCompleted =
    dates &&
    dates.some(
      ({ timeframe }: TimeFrame) => timeframe.fromDate == fromDateUnixTs
    ); // is this a 'Red dot' marked day?

  const currentHabitHierarchyNode = hierarchy(hierarchyData).find(
    (n: any) => n.data.name == currentHabit.meta.name
  );
  if (!!currentHabitHierarchyNode?.data?.content) {
    const currentHabitStatus = parseTreeValues(
      currentHabitHierarchyNode.data.content
    ).status;
    if (currentHabitStatus == "OOB") return "OOB";
    if (currentHabitStatus == "") return "noHabitDate";
  }

  const hasDescendantsIncomplete =
    !!currentHabitHierarchyNode?.children &&
    currentHabitHierarchyNode.children.some(
      (childNode: any) =>
        parseTreeValues(childNode.data.content).status !== "true"
    );
  return dateIsCompleted && hasDescendantsIncomplete
    ? "parentCompleted"
    : dateIsCompleted;
};
