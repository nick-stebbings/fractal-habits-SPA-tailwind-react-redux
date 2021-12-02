import { selectCurrentHabit } from "./../features/habit/selectors";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { getUIStatus } from "../features/ui/selectors";
import { fetchDomainsREST } from "../features/domain/actions";
import { fetchHabitTreeREST } from "../features/hierarchy/actions";
import { selectCurrentDateId } from "../features/space/slice";
import { fetchHabitREST } from "../features/habit/actions";

export default function useFetch(isVisComponent: boolean) {
  const dispatch = useAppDispatch();
  const UIStatus = useAppSelector(getUIStatus);
  const currentHabit = useAppSelector(selectCurrentHabit);
  const currentDateId = useAppSelector(selectCurrentDateId);

  const loadDomains = () => dispatch(fetchDomainsREST());
  const loadNewCurrentHabit = () =>
    dispatch(fetchHabitREST({ id: currentHabit?.meta?.id }));
  const loadTreeData = async () =>
    dispatch(fetchHabitTreeREST({ domainId: 1, dateId: currentDateId }));

  const loadData = async function () {
    await loadDomains();
    isVisComponent && (await loadTreeData());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentHabit?.meta.id == 0 || currentHabit?.meta?.name) {
      return;
    }
    loadNewCurrentHabit();
    isVisComponent && loadTreeData();
  }, [currentHabit?.meta?.id]);

  return { UIStatus };
}
