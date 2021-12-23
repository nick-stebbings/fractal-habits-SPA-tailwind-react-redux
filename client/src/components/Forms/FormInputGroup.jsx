import React from "react";

export const InputGroup = ({ classString, label, name, children }) => {
  return (
    <div className="flex flex-col mt-0 md:mt-2 md:mt-6">
      <label className={classString} htmlFor={name}>
        {label}
      </label>
      {children}
    </div>
  );
};
