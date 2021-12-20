// @ts-ignore
import { RootState } from "app/store";

// @ts-ignore
import { Node } from "app/features/node/types";

export const selectCurrentNode = (state: RootState): Node => {
  return state?.node?.current;
};

export const selectStoredNodes = (state: RootState): Node[] => {
  return state?.node?.myRecords;
};

export const selectCurrentNodeByMptt = (
  state: RootState,
  lft: number,
  rgt: number
): Node => {
  return state.node?.myRecords.filter(
    (n: Node) => n.lft === +lft && n.rgt === +rgt
  )[0];
};
