import BASE_URL from "services/restApis";
import { todoSlice } from "./reducer";
const {
  createList,
  deleteList,
  updateList,
  createTodo,
  deleteTodo,
  updateTodo,
} = todoSlice.actions;

export {
  createList,
  deleteList,
  updateList,
  createTodo,
  deleteTodo,
  updateTodo,
};
