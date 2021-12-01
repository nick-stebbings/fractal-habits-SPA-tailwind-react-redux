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

export const selectCurrentHabitDates = (state: RootState) => {
  return state?.habitDate?.myRecords.filter((record: Habit) => {});
};

export const selectIsCompletedDate = (fromDateUnixTs: number) => {
  return createSelector(
    [selectStoredHabitDates, selectCurrentHierarchy, selectCurrentHabit],
    (dates, hierarchyData, currentHabit) => {
      const isCompleted =
        dates &&
        dates.some(
          ({ timeframe }: TimeFrame) => timeframe.fromDate == fromDateUnixTs
        );

      const currentHabitHierarchyNode = hierarchy(hierarchyData).find(
        (n: any) => n.data.name == currentHabit.meta.name
      );
      const hasDescendantsIncomplete =
        !!currentHabitHierarchyNode?.children &&
        currentHabitHierarchyNode.children.some(
          (childNode: any) =>
            parseTreeValues(childNode.data.content).status !== "true"
        );
      return isCompleted && hasDescendantsIncomplete
        ? "parentCompleted"
        : isCompleted;
    }
  );
};
