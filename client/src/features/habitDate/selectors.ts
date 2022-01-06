import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";

import { TimeFrame } from "app/types";

import { Habit } from "app/features/habit/types";

import { selectCurrentHierarchyRecords } from "../hierarchy/selectors";
import { selectCurrentHabit } from "../habit/selectors";
import { selectCurrentDateId } from "../space/slice";
import { selectStoredHabits } from "../habit/selectors";
import {
  parseTreeValues,
  areSomeDescendantsIncomplete,
  areAllChildrenIncomplete,
  areAllChildrenComplete,
  isALeaf,
  notOOB,
  cumulativeValue,
} from "../hierarchy/components/helpers";

export const selectStoredHabitDates = (state: RootState) => {
  // Return all stored records in one array
  return (
    state?.habitDate?.myRecords &&
    Object.values(state.habitDate.myRecords).length &&
    [].concat.apply([], Object.values(state.habitDate.myRecords))
  );
};

export const selectUnStoredHabitDates = (state: RootState) => {
  return state?.habitDate?.unPersistedForDate;
};

export const selectInUnpersisted = (nodeData: any) =>
  createSelector(
    [selectUnStoredHabitDates, selectCurrentDateId, selectStoredHabits],
    (unPersisted, currentDateId, storedHabits) => {
      if (unPersisted.length == 0) return false;
      const habitId =
        storedHabits[
          storedHabits.findIndex((h: Habit) => h.meta?.name == nodeData.name)
        ]?.meta?.id;

      return (
        unPersisted.findIndex((hd: any) => {
          return hd?.habit_id == habitId && hd?.date_id == currentDateId;
        }) !== -1
      );
    }
  );

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
          ({ timeframe, habitId }: TimeFrame) =>
            timeframe.fromDate == fromDateUnixTs &&
            habitId === currentHabit?.meta?.id
        );

      // Next check the JSON tree data
      const hierarchyDataForDateId = hierarchyData[dateId];
      const currentHabitHierarchyNode =
        !!hierarchyDataForDateId?.find &&
        hierarchyDataForDateId.find(
          (n: any) => n.data.name == currentHabit?.meta.name
        );
      if (!currentHabitHierarchyNode) return "OOB";

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
      // Determine if the node is complete but its subtree is not
      const nodeDescendants = currentHabitHierarchyNode
        ?.descendants()
        ?.slice(1)
        .filter(notOOB)
        .filter(isALeaf);

      const someDescendantIncomplete =
        areSomeDescendantsIncomplete(nodeDescendants);
      const allChildrenIncomplete = areAllChildrenIncomplete(
        currentHabitHierarchyNode?.children
      );
      const allChildrenComplete = areAllChildrenComplete(
        currentHabitHierarchyNode?.children
      );

      if (!!currentHabitNodeDataForDate) {
        // Guard clauses for out of bounds and when there is not a temp habit date in the store
        currentHabitStatus = parseTreeValues(
          currentHabitNodeDataForDate
        )!.status;
        if (currentHabitStatus == "OOB") return "OOB";
        if (currentHabitStatus === "false") return false;
        if (
          currentHabitStatus == "" &&
          typeof habitDateInStore == "undefined" &&
          !currentHabitHierarchyNode.value &&
          !currentHabitHierarchyNode?.children
        )
          return "noHabitDate";
      }

      const completedInTreeOrInStore =
        currentHabitHierarchyNode?.value == 1 ||
        currentHabitStatus == "true" ||
        !!habitDateInStore ||
        dateIsPersistedCompleted ||
        allChildrenComplete ||
        currentHabitHierarchyNode
          ?.descendants()
          ?.map((c: any) => cumulativeValue(c))
          .includes(1);

      return completedInTreeOrInStore
        ? someDescendantIncomplete
          ? "parentCompleted"
          : true
        : false;
    }
  );
};
