import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";

import TodoList from "features/todo/components/TodoList";

import { fetchHabitREST } from "features/habit/actions";

import { getCurrent } from "features/todo/selectors";

interface indexProps {}

export const App: React.FC<indexProps> = ({}) => {
  const dispatch = useAppDispatch();
  const currentList = useAppSelector(getCurrent);

  const [lists, setLists] = useState(currentList);

  useEffect(() => {
    loadData().then(() => {
      setLists(currentList);
    });
  }, []);

  const loadData = async () => dispatch(fetchHabitREST(1));

  return (
    <div className="App">
      <div className="current-list container">
        {lists && <TodoList list={lists} />}
      </div>
    </div>
  );
};
