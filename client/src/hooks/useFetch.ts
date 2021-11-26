import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { getUIStatus } from "../features/ui/selectors";
import { fetchDomainsREST } from "../features/domain/actions";
import { fetchHabitTreeREST } from "../features/hierarchy/actions";
import { selectCurrentDateId } from "../features/space/slice";

export default function useFetch(isVisComponent: boolean) {
  const dispatch = useAppDispatch();
  const UIStatus = useAppSelector(getUIStatus);
  const currentDateId = useAppSelector(selectCurrentDateId);

  const loadDomains = () => dispatch(fetchDomainsREST());

  const loadTreeData = async () =>
    dispatch(fetchHabitTreeREST({ domainId: 1, dateId: currentDateId }));
  const loadData = async function () {
    await loadDomains();
    isVisComponent && (await loadTreeData());
  };

  useEffect(() => {
    loadData();
  }, []);

  return { UIStatus };
}
