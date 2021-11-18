import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import TodoList from "../features/todo/components/TodoList";
import { Header } from "./Header";

import { fetchHabitsREST } from "../features/habit/actions";
import { fetchDomainsREST } from "../features/domain/actions";

import { selectCurrentList } from "../features/todo/selectors";
import { selectCurrentHabit } from "../features/habit/selectors";

import { withModal } from '../components/HOC/withModal'
import { getUIStatus } from "../features/ui/selectors";

interface indexProps {}

export const App: React.FC<indexProps> = ({}) => {

  const HeaderWithModal = withModal(Header)
  
  const dispatch = useAppDispatch();
  const UIStatus = useAppSelector(getUIStatus);
  const currentList = useAppSelector(selectCurrentList);
  const currentHabit = useAppSelector(selectCurrentHabit);

  const [lists, setLists] = useState(currentList);
  const [habit, setHabit] = useState(currentHabit);

  const loadHabits = () => dispatch(fetchHabitsREST());
  const loadDomains = () => dispatch(fetchDomainsREST());

  const loadData = async function () {
    await loadDomains();
    setHabit(currentHabit);
  };

  useEffect(() => loadData(), []);

  return (
    <>
      <HeaderWithModal type={UIStatus} />
      {/* <div className="current-list container">
        {lists && <TodoList list={lists}></TodoList>}
      </div> */}
    </>
  );
};
