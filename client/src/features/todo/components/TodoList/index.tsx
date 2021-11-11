import React, { useState, memo } from "react";

import { index as TodoItem } from "../TodoItem";
import { Footer } from "./Footer";

import { store } from "app/store";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { TodoList, Todo } from "../../types";
import { getCurrent } from "../../selectors";
import {
  createTodo,
  deleteTodo,
  updateTodo,
  createList,
  // createTodoListREST,
  // updateTodoListREST,
  // fetchTodoListsREST,
  updateList,
} from "../../actions";
interface indexProps {
  list: TodoList;
  hasBeenPersisted?: boolean;
}

const index: React.FC<indexProps> = ({
  list: { todos, id: listId },
  hasBeenPersisted,
}) => {
  const [hasBeenSaved, setHasBeenSaved] = useState(hasBeenPersisted || false);
  const [currentList, setCurrentList] = useState<TodoList>({
    id: listId,
    todos,
  });
  const [newTodo, setNewTodo] = useState<string>("");

  const dispatch = useAppDispatch();
  const storedTodos = useAppSelector(getCurrent)?.todos;

  const handleFilter = (e: any) => {
    switch (e.target.textContent) {
      case "All":
        setCurrentList({
          id: listId,
          todos: storedTodos,
        });
        return;
      case "Active":
        setCurrentList({
          id: listId,
          todos: storedTodos.filter((td: Todo) => td.status == false),
        });
        return;
      case "Completed":
        setCurrentList({
          id: listId,
          todos: storedTodos.filter((td: Todo) => td.status == true),
        });
        return;
    }
  };

  const handleToggle = (e: any) => {
    const newValue = e.target.checked;
    const id = e.target.parentNode.parentNode.dataset.todo_id;
    const todoPatch = { id, status: newValue };
    store.dispatch(updateTodo({ todoPatch }));
    setCurrentList({
      id: listId,
      todos: storedTodos,
    });
  };

  const handleDestroy = (e: any) => {
    const tdId = e.target.parentNode.dataset.todo_id;
    const deleteAction = deleteTodo({
      id: tdId,
    });
    dispatch(deleteAction);
    setCurrentList({
      id: listId,
      todos: storedTodos,
    });
  };

  const handleDestroyAll = (e: any) => {
    const list = {
      id: listId,
      todos: [],
    };
    const updateAction = updateList({ list });
    dispatch(updateAction);
    setCurrentList({
      id: listId,
      todos: [],
    });
  };

  const handleKeyUp = (e: any) => {
    if (e.key === "Enter") {
      const newTodoItem = {
        id: `${listId}-${Math.floor(Math.random() * 1000)}`,
        description: newTodo,
        status: false,
      };
      dispatch(
        createTodo({
          todo: newTodoItem,
        })
      );
      setCurrentList({
        id: listId,
        todos: currentList.todos.concat([newTodoItem]),
      });
      setNewTodo("");
    }
  };
  const handleSaveList = (e: any) => {
    const uId = `${Math.floor(Math.random() * todos.length * 100)}`;
    const list = {
      id: hasBeenSaved ? listId : uId,
      todos: { ...currentList.todos },
    };
    const cellIdString = store.getState()?.cell?.cellIdString;

    try {
      hasBeenSaved
        ? dispatch(updateList({ list })) //&&
        : //dispatch(updateTodoListREST(cellIdString, list))
          dispatch(createList({ list })); //&&
      //dispatch(createTodoListREST(cellIdString, list));
      setHasBeenSaved(true);
    } catch (err) {
      console.log("err :>> ", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add a Todo and press enter"
        onChange={(e) => {
          setNewTodo(e.target.value);
        }}
        onKeyUp={handleKeyUp}
        value={newTodo}
      />
      <ul className="todo-list" data-testid="list">
        {currentList &&
          currentList.todos?.map((listItem: Todo) => {
            return (
              <TodoItem
                key={listItem.id}
                todo={listItem}
                handleToggle={handleToggle}
                handleDestroy={handleDestroy}
              />
            );
          })}
      </ul>
      <Footer
        count={
          currentList.todos.length -
          currentList.todos.filter((td: Todo) => td.status).length
        }
        listLength={currentList.todos.length}
        handleFilter={handleFilter}
        handleDestroyAll={handleDestroyAll}
        handleSaveList={handleSaveList}
      />
    </div>
  );
};

export default memo(index);
