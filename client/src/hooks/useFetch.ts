import { selectCurrentHabit } from "./../features/habit/selectors";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { selectCurrentHierarchyRecords } from "features/hierarchy/selectors";
import { getUIStatus } from "../features/ui/selectors";
import { fetchDomainsREST } from "../features/domain/actions";
import {
  fetchHabitTreeREST,
  fetchHabitTreesREST,
} from "../features/hierarchy/actions";
import { visActions } from "../features/hierarchy/reducer";
const { clearFutureCache } = visActions;
import { selectCurrentDateId } from "../features/space/slice";
import { fetchHabitREST } from "../features/habit/actions";
import { fetchNodesREST } from "../features/node/actions";

export default function useFetch(isVisComponent: boolean) {
  const dispatch = useAppDispatch();
  const UIStatus = useAppSelector(getUIStatus);
  const currentHabit = useAppSelector(selectCurrentHabit);
  const currentDateId = useAppSelector(selectCurrentDateId);
  const currentHierarchyRecords = useAppSelector(selectCurrentHierarchyRecords);

  const loadDomains = () => dispatch(fetchDomainsREST());
  const loadNewCurrentHabit = () =>
    dispatch(fetchHabitREST({ id: currentHabit?.meta?.id }));
  const loadNodeData = async () => dispatch(fetchNodesREST());
  const loadTreeData = async () =>
    dispatch(fetchHabitTreeREST({ domainId: 1, dateId: currentDateId }));
  const loadWeeklyTreeData = async () =>
    dispatch(fetchHabitTreesREST({ domainId: 1, dateId: currentDateId - 7 }));
  const removeFutureRecords = async () =>
    dispatch(clearFutureCache({ currentDateId }));

  const loadData = async function () {
    await loadDomains();
    await loadNodeData();
    if (isVisComponent) {
      await loadTreeData();
      loadWeeklyTreeData();
    }
  };

  useEffect(() => {
    if (
      currentHierarchyRecords &&
      Object.keys(currentHierarchyRecords).length !== 0
    )
      return;
    loadData();
  }, []);

  useEffect(() => {
    if (currentHabit?.meta.id == 0 || currentHabit?.meta?.name) return;
    loadNodeData();
    loadNewCurrentHabit();
    if (
      isVisComponent &&
      (currentHabit?.meta.id !== 0 || currentHabit?.meta.id == 1) &&
      !currentHabit?.meta?.name
    ) {
      // A new habit and node was created or one was deleted so refresh weekly hierarchies
      loadWeeklyTreeData();
      removeFutureRecords();
    }
    isVisComponent && loadTreeData();
  }, [currentHabit?.meta?.id]);

  return { UIStatus };
}
