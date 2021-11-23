import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import TodoList from "../features/todo/components/TodoList";
import { Header } from "./Header";
import { Layout } from "./Layout";

import { fetchHabitsREST } from "../features/habit/actions";
import { fetchDomainsREST } from "../features/domain/actions";
// @ts-ignore
import { fetchHabitTreeREST } from "features/hierarchy/actions";
import reducer from "../features/ui/reducer";
const { toggleConfirm } = reducer.actions;

import { selectCurrentList } from "../features/todo/selectors";
import { selectCurrentHabit } from "../features/habit/selectors";
import { getUIStatus } from "../features/ui/selectors";

import { withModal } from '../components/HOC/withModal'
import {HabitTree} from "../features/hierarchy/components/HabitTree";

interface indexProps {
  children?: JSX.Element
}

export default function App ({children}: indexProps) {
  const LayoutWithModal = React.memo(withModal(Layout))
  
  const dispatch = useAppDispatch();
  const UIStatus = useAppSelector(getUIStatus);
  const currentList = useAppSelector(selectCurrentList);
  const currentHabit = useAppSelector(selectCurrentHabit);

  const [lists, setLists] = useState(currentList);
  const [habit, setHabit] = useState(currentHabit);

  const loadHabits = () => dispatch(fetchHabitsREST());
  const loadDomains = () => dispatch(fetchDomainsREST());

  const isVis = true
  
  const loadTreeData = async () => dispatch(fetchHabitTreeREST({ domainId: 1, dateId: 2 }));
  const loadData = async function () {
    await loadDomains();
    setHabit(currentHabit);

    isVis && await loadTreeData()
  };
  useEffect(() => {
    loadData()
  }, []);
  return (
      <>
        <LayoutWithModal type={UIStatus} isVis={isVis} children={children} />
        <Header />
      </>
  );
};
