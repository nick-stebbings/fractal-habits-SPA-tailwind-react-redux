import React, { useState, useEffect } from "react";

import { Todo } from "../../types";

interface indexProps {
  todo: Todo;
  handleDestroy?: (ev: any) => void;
  handleToggle?: (ev: any) => void;
}

export const index: React.FC<indexProps> = ({
  todo,
  handleDestroy,
  handleToggle,
}) => {
  const [isComplete, setIsComplete] = useState<boolean>(todo.status);
  useEffect(() => {
    setIsComplete(todo.status);
  }, [todo.status]);

  return (
    <li
      data-todo_id={todo.id}
      style={{ textDecoration: isComplete ? "line-through" : "none" }}
    >
      <label className={isComplete ? "complete" : "incomplete"}>
        {todo.description}
        <input
          type="checkbox"
          onClick={handleToggle}
          data-testid={`toggle-${todo.id}`}
          defaultChecked={isComplete}
        />
      </label>
      <button
        type="button"
        data-testid={`delete-${todo.id}`}
        onClick={handleDestroy}
        className="destroy"
      />
    </li>
  );
};
