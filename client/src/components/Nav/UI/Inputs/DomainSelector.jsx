import React from "react";
import { useAppSelector } from "app/hooks";

import {
  selectCurrentDomain,
  selectStoredDomains,
} from "features/domain/selectors";

export const DomainSelector = () => {
  const currentDomain = useAppSelector(selectCurrentDomain);
  const allDomains = useAppSelector(selectStoredDomains);

  return (
    <select
      className={
        "select form-select domain-selector w-full lg:pt-2 pl-2 sm:h-10 h-6 py-0 md:p-2 mr-1 xl-mt-4 rounded-2xl bg-white"
      }
      selectedindex={allDomains && allDomains.indexOf(currentDomain)}
      tabIndex={2}
    >
      {allDomains &&
        allDomains.map(({ meta: { name: optionName } }, idx) => (
          <option className="text-xl font-bold" key={idx}>
            {optionName}
          </option>
        ))}
    </select>
  );
};
