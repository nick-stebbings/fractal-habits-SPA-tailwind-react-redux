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

export const selectUnStoredHabitDates = (state: RootState) => {
  return state?.habitDate?.unPersistedForDate;
};

export const selectCurrentHabitDate = (state: RootState) => {
  return state?.habitDate?.current;
};

export const selectAccumulatedStatusForDate = (
  fromDateUnixTs: number,
  dateId: number
) => {
  return createSelector(
    [
      selectStoredHabitDates,
      selectCurrentHierarchyRecords,
      selectCurrentHabit,
      selectUnStoredHabitDates,
    ],
    (persistedDates, hierarchyData, currentHabit, unPersisted) => {
      // Responsible for collating data from the store and the habit tree, feeding back the string
      // to determine what colour the status is for this habit on this day

      // First check persisted data
      const dateIsPersistedCompleted =
        persistedDates &&
        persistedDates.some(
          ({ timeframe }: TimeFrame) => timeframe.fromDate == fromDateUnixTs
        );

      // Next check the JSON tree data
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

      // Next check the store
      let habitDateInStore;
      if (unPersisted.length > 0) {
        const tempHabitDate = unPersisted.find(
          (hd) => hd.date_id == dateId && hd.habit_id == currentHabit?.meta?.id
        );
        if (tempHabitDate) {
          habitDateInStore = tempHabitDate.completed_status;
        }
      }

      // Guard clauses for out of bounds and when there is not a temp habit date in the store
      if (!!currentHabitNodeDataForDate) {
        currentHabitStatus = parseTreeValues(
          currentHabitNodeDataForDate
        )!.status;
        if (currentHabitStatus == "OOB") return "OOB";
        if (currentHabitStatus == "" && typeof habitDateInStore == "undefined")
          return "noHabitDate";
      }

      // Determine if the node is complete but its subtree is not
      const hasDescendantsIncomplete =
        !!currentHabitHierarchyNode?.children &&
        currentHabitHierarchyNode
          .descendants()
          .some(
            (descendant: any) =>
              !["true", "OOB"].includes(
                parseTreeValues(descendant.data.content)!.status
              )
          );

      const completedInTreeOrInStore =
        currentHabitStatus == "true" ||
        habitDateInStore ||
        dateIsPersistedCompleted;
      return completedInTreeOrInStore && hasDescendantsIncomplete
        ? "parentCompleted"
        : completedInTreeOrInStore;
    }
  );
};
