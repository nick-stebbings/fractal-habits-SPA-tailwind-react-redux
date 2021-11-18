import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import TodoList from "../features/todo/components/TodoList";
import { Header } from "./Header";
import { withSpinner } from "components/HOC/withSpinner/index";
console.log('withSpinner(Header) :>> ', withSpinner(Header));
const HeaderWithSpinner = withSpinner(Header);

import { fetchHabitsREST } from "../features/habit/actions";
import { fetchDomainsREST } from "../features/domain/actions";

import { selectCurrentList } from "../features/todo/selectors";
import { selectCurrentHabit } from "../features/habit/selectors";


interface indexProps {}

export const App: React.FC<indexProps> = ({}) => {
  const dispatch = useAppDispatch();
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
      <HeaderWithSpinner />
      {/* <div className="current-list container">
        {lists && <TodoList list={lists}></TodoList>}
      </div> */}
    </>
  );
};
