import React from "react";

import { GeneralButton } from "./Buttons/GeneralButton";
// import { changedHabit } from "../../../../../assets/scripts/controller";

export const ListCard = ({ value }) => {
  let isDemo = false;
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="habit-list-details">
        <h2 className="habit-list-details-name">{value.name}</h2>
        <p className="text-grey-darkest w-full">{value.description}</p>
      </div>
      <GeneralButton
        id={`habit-list-select-habit-${value.id}`}
        color="hover:bg-balance-buttonbg-digbluelighter bg-balance-buttonbg-digblue"
        dataAttr={value.id}
        label="Choose"
        disabled={isDemo ? "true" : "false"}
        class={isDemo ? "inactive" : "active"}
      />
    </div>
  );
};
