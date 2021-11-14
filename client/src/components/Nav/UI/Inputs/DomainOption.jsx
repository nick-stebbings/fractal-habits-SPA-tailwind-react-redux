import React from "react";

export const DomainOption = ({ value }) => {
  return (
    <option className="text-xl font-bold" value={value}>
      {value}
    </option>
  );
};
