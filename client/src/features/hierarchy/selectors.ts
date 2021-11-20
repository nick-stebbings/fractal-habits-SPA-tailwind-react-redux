// @ts-ignore
import { RootState } from "app/store";
import { createSelector } from "@reduxjs/toolkit";
// @ts-ignore
import { Hierarchy } from "app/features/hierarchy/types";

export const selectCurrentTree = (state: RootState): Hierarchy => {
  return state?.hierarchy.current;
};
