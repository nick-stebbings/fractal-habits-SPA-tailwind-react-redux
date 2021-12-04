// @ts-ignore
import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
// @ts-ignore
import { Hierarchy } from "app/features/hierarchy/types";

export const selectCurrentHierarchy = (state: RootState): Hierarchy => {
  return (
    !!state?.hierarchy.current.json && JSON.parse(state?.hierarchy.current.json)
  );
};

export const selectCurrentTree = (state: RootState): Hierarchy => {
  return state?.hierarchy.treeVis;
};

export const selectCurrentHierarchyRecords = (state: RootState): Hierarchy => {
  return state?.hierarchy.myRecords;
};

export const selectCurrentRadial = (state: RootState): Hierarchy => {
  return state?.hierarchy.radialVis;
};

export const selectCurrentCluster = (state: RootState): Hierarchy => {
  return state?.hierarchy.clusterVis;
};
export const selectHasStoredTreeForDateId = (dateId: number) =>
  createSelector([selectCurrentHierarchyRecords], (records) => {
    return records && Object.keys(records).includes(String(dateId));
  });
