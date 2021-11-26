import { React } from "react";

export const InputGroup = ({ classString, label, name, children }) => {
  return (
    <div class="flex flex-col mt-6">
      <label class={classString} for={name}>
        {label}
      </label>
      {children}
    </div>
  );
};
