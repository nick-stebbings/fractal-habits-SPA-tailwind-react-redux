import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";

import { Profiles } from "features/user/components/Profiles";
import TodoList from "features/todo/components/TodoList";

import { fetchHabitREST } from "features/habit/actions";

import { getCurrent } from "features/todo/selectors";

interface indexProps {}

export const App: React.FC<indexProps> = ({}) => {
  const dispatch = useAppDispatch();
  const currentList = useAppSelector(getCurrent);
  const cellIdString = useAppSelector(getStringId);

  const [lists, setLists] = useState(currentList);
  let [listObj, setListObj] = useState(JSON.stringify(lists));

  useEffect(() => {
    loadData().then(() => {
      setLists(currentList);
      setListObj(JSON.stringify(currentList));
    });
  }, [listObj]);

  const loadData = async () => {};

  return (
    <div className="App">
      {/* <div className="public-lists container">
        {Object.keys(lists).map((id, i) => (
          <TodoList list={{ id, todos: lists[id].todos }} key={i} />
        ))}
      </div> */}
      <div className="current-list container">
        {lists && <TodoList list={lists} />}
        <Profiles />
      </div>
    </div>
  );
};
