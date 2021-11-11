import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, TodoList, TodoLists } from "./types";
import { Dictionary } from "app/types";
import merge from "deepmerge";

export const initialState: Dictionary<TodoList> = {
  currentList: { id: "0", todos: [] },
};

export interface NewListPayload {
  id: string;
  list: TodoList;
}

export interface NewTodoPayload {
  todo: Todo;
}

export interface DeleteListPayload {
  id: string;
}

export interface DeleteTodoPayload {
  id: string;
}

export interface UpdateTodoPayload {
  todoPatch: Partial<Todo>;
}

export const todoSlice: any = createSlice({
  name: "todo",
  initialState,
  reducers: {
    createList(state, action: PayloadAction<NewListPayload>) {
      const { id, todos } = action.payload.list;
      state.currentList.id = id;
      state.currentList.todos = todos;
    },
    deleteList(state) {
      state.currentList = initialState.currentList;
    },
    updateList(state, action: PayloadAction<Partial<NewListPayload>>) {
      const { todos } = action.payload.list;
      state.currentList.todos = todos;
    },
    createTodo(state, action: PayloadAction<NewTodoPayload>) {
      const { todo } = action.payload;
      let currentTodos = state?.currentList?.todos;
      if (currentTodos) {
        currentTodos.push(todo);
      } else {
        currentTodos = [todo];
      }
    },
    deleteTodo(state, action: PayloadAction<DeleteTodoPayload>) {
      const { id } = action.payload;
      const next = { ...state };
      next.currentList!.todos = state.currentList!.todos.filter(
        (td: Todo) => td.id !== id
      );
      state = next;
    },
    updateTodo(state, action: PayloadAction<UpdateTodoPayload>) {
      const { todoPatch } = action.payload;
      const index: number = state.currentList!.todos!.findIndex(
        (td: Todo) => td.id == todoPatch.id
      );
      const next = { ...state };
      const newList = [...(state.currentList?.todos || [])];
      newList[index] = merge.all([
        [...state.currentList!.todos][index] || {},
        todoPatch,
      ]);
      index !== -1 && (next.currentList!.todos = newList);
      state = next;
    },
  },
  // extraReducers: (builder) => {

  // },
});

export default todoSlice.reducer;
