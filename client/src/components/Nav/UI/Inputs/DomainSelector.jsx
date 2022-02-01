import React from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";

import { domainActions } from "features/domain/reducer";
const { updateCurrentIndex, updateCurrentDomainFromIndex } = domainActions;

import { visActions } from "features/hierarchy/reducer";
const { updateCurrentHierarchy } = visActions;

import {
  selectCurrentDomain,
  selectStoredDomains,
} from "features/domain/selectors";

export const DomainSelector = () => {
  const currentDomain = useAppSelector(selectCurrentDomain);
  const allDomains = useAppSelector(selectStoredDomains);
  const dispatch = useAppDispatch();

  return (
    <select
      className={
        "select form-select domain-selector w-full lg:pt-2 pl-2 sm:h-10 h-6 py-0 md:p-2 mr-1 xl-mt-4 rounded-2xl bg-white"
      }
      selectedindex={allDomains && allDomains.indexOf(currentDomain)}
      tabIndex={2}
      onChange={(e) => {
        dispatch(updateCurrentIndex(e.target.selectedIndex));
        dispatch(updateCurrentDomainFromIndex(e.target.selectedIndex));
        dispatch(updateCurrentHierarchy(0));
      }}
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
