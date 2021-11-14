import React from "react";
import DomainOption from "./DomainOption";

export const DomainSelector = () => {
  return (
    <select
      className={
        "select form-select domain-selector w-full lg:pt-2 pl-2 sm:h-10 h-6 py-0 md:p-2 mr-1 xl-mt-4 rounded-2xl"
      }
      selectedIndex={0} //"`DomainStore.list().indexOf(DomainStore.current()`"
      tabIndex={2}
    >
      {DomainStore.list().map((domain, idx) => (
        <DomainOption
          key={idx}
          value={domain.name}
          selected={"DomainStore.current()?.name === domain.name"}
        >
          {domain.name}
        </DomainOption>
      ))}
    </select>
  );
};
