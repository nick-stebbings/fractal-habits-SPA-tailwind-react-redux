import { Dictionary } from "app/types";
export interface Todo {
  id: string | number;
  description: string;
  status: boolean;
}
export interface TodoList {
  id: string;
  todos: Todo[];
}
export interface TodoLists extends Dictionary<TodoList> {}
