// @ts-ignore
import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
// @ts-ignore
import { TimeFrame } from "app/types";
// @ts-ignore
import { Habit } from "app/features/habit/types";

import { selectCurrentHierarchyRecords } from "../hierarchy/selectors";
import { selectCurrentHabit } from "../habit/selectors";
import { parseTreeValues } from "../hierarchy/components/helpers";

export const selectStoredHabitDates = (state: RootState) => {
  return state?.habitDate?.myRecords;
};

export const selectCurrentHabitDate = (state: RootState) => {
  return state?.habitDate?.current;
};
export const selectAccumulatedStatusForDate = (
  fromDateUnixTs: number,
  dateId: number
) => {
  return createSelector(
    [selectStoredHabitDates, selectCurrentHierarchyRecords, selectCurrentHabit],
    (dates, hierarchyData, currentHabit) => {
      const dateIsCompleted =
        dates &&
        dates.some(
          ({ timeframe }: TimeFrame) => timeframe.fromDate == fromDateUnixTs
        );

      const hierarchyDataForDateId = hierarchyData[dateId];
      const currentHabitHierarchyNode =
        !!hierarchyDataForDateId &&
        hierarchyDataForDateId.find(
          (n: any) => n.data.name == currentHabit.meta.name
        );
      if (!hierarchyDataForDateId) return "OOB";

      let currentHabitStatus;
      const currentHabitNodeDataForDate =
        currentHabitHierarchyNode?.data?.content;
      if (!!currentHabitNodeDataForDate) {
        currentHabitStatus = parseTreeValues(
          currentHabitNodeDataForDate
        )!.status;
        if (currentHabitStatus == "OOB") return "OOB";
        if (currentHabitStatus == "") return "noHabitDate";
      }

      const hasDescendantsIncomplete =
        !!currentHabitHierarchyNode?.children &&
        currentHabitHierarchyNode.children.some(
          (childNode: any) =>
            !["true", "OOB"].includes(
              parseTreeValues(childNode.data.content)!.status
            )
        );
      const completedInTreeOrInStore =
        currentHabitStatus == "true" || dateIsCompleted;
      return completedInTreeOrInStore && hasDescendantsIncomplete
        ? "parentCompleted"
        : completedInTreeOrInStore;
    }
  );
};
