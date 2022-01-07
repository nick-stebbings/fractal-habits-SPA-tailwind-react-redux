import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";

import { Hierarchy } from "app/features/hierarchy/types";

export const selectCurrentHierarchy = (state: RootState): Hierarchy => {
  return state?.hierarchy.current.hier;
};

export const selectCurrentHierarchyRecords = (state: RootState): Hierarchy => {
  return state?.hierarchy.myRecords;
};

export const selectCurrentTree = (state: RootState) => {
  return state?.hierarchy.treeVis;
};

export const selectCurrentRadial = (state: RootState) => {
  return state?.hierarchy.radialVis;
};

export const selectCurrentCluster = (state: RootState) => {
  return state?.hierarchy.clusterVis;
};

export const selectOtherVisObjects = (
  currentVisType: string,
  state: RootState
) => {
  switch (currentVisType) {
    case "tree":
      return [state?.hierarchy.clusterVis, state?.hierarchy.radialVis];
    case "radial":
      return [state?.hierarchy.clusterVis, state?.hierarchy.treeVis];
    case "cluster":
      return [state?.hierarchy.treeVis, state?.hierarchy.radialVis];
  }
};

export const selectHasStoredTreeForDateId = (dateId: number) =>
  createSelector([selectCurrentHierarchyRecords], (records) => {
    return records && Object.keys(records).includes(String(dateId));
  });
