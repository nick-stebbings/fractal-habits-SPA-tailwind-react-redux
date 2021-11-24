// @ts-ignore
import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
// @ts-ignore
import { Hierarchy } from "app/features/hierarchy/types";

export const selectCurrentHierarchy = (state: RootState): Hierarchy => {
  return (
    state?.hierarchy.current.json && JSON.parse(state?.hierarchy.current.json)
  );
};

export const selectCurrentTree = (state: RootState): Hierarchy => {
  return state?.hierarchy.treeVis;
};

export const selectCurrentRadial = (state: RootState): Hierarchy => {
  return state?.hierarchy.radialVis;
};

export const selectCurrentCluster = (state: RootState): Hierarchy => {
  return state?.hierarchy.clusterVis;
};
