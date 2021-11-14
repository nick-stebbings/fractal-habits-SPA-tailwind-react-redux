import React from "react";

export const DomainOption = ({ initValue }) => {
  return (
    <option className="text-xl font-bold" initValue={initValue}>
      {initValue}
    </option>
  );
};
