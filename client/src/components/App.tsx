import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import TodoList from "../features/todo/components/TodoList";
import { Header } from "./Header";

import { fetchHabitsREST } from "../features/habit/actions";

import { getCurrentList } from "../features/todo/selectors";
import { getCurrentHabit } from "../features/habit/selectors";

interface indexProps {}

export const App: React.FC<indexProps> = ({}) => {
  const dispatch = useAppDispatch();
  const currentList = useAppSelector(getCurrentList);
  const currentHabit = useAppSelector(getCurrentHabit);

  const [lists, setLists] = useState(currentList);
  const [habit, setHabit] = useState(currentHabit);

  const loadHabits = () => dispatch(fetchHabitsREST());
  const loadData = async function () {
    await loadHabits();
    setHabit(currentHabit);
  };
  useEffect(() => loadData(), []);

  return (
    <div className="current-list container">
      <Header />
      {lists && <TodoList list={lists}></TodoList>}
    </div>
  );
};
