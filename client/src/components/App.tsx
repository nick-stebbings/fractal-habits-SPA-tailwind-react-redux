import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import TodoList from "../features/todo/components/TodoList";
import { Header } from "./Header";
import { Layout } from "./Layout";

import { fetchHabitsREST } from "../features/habit/actions";
import { fetchDomainsREST } from "../features/domain/actions";
import reducer from "../features/ui/reducer";
const { toggleConfirm } = reducer.actions;

import { selectCurrentList } from "../features/todo/selectors";
import { selectCurrentHabit } from "../features/habit/selectors";
import { getUIStatus } from "../features/ui/selectors";

import { withModal } from '../components/HOC/withModal'

interface indexProps {}

export const App: React.FC<indexProps> = ({}) => {

  const LayoutWithModal = withModal(Layout)
  
  const dispatch = useAppDispatch();
  const UIStatus = useAppSelector(getUIStatus);
  const currentList = useAppSelector(selectCurrentList);
  const currentHabit = useAppSelector(selectCurrentHabit);

  const [lists, setLists] = useState(currentList);
  const [habit, setHabit] = useState(currentHabit);

  const loadHabits = () => dispatch(fetchHabitsREST());
  const loadDomains = () => dispatch(fetchDomainsREST());

  const loadData = async function () {

  // dispatch(toggleConfirm())
    await loadDomains();
    setHabit(currentHabit);
  };

  useEffect(() => {
    loadData()
  }, []);

  return (
    <LayoutWithModal type={UIStatus}>
      <Header />
    </LayoutWithModal>
  );
};
