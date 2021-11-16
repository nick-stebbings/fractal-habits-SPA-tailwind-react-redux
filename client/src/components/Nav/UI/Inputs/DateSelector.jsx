import React from "react";
import { useAppSelector } from "app/hooks";

import { selectCurrentHabit } from "features/habit/selectors";
import { DateTime } from "luxon";
import { selectCurrentSpace, selectThisWeekSpaces } from "features/space/slice";
import { stringifyDate } from "features/habitDate/utils";

export const DateSelector = function () {
  const currentDateSpace = useAppSelector(selectCurrentSpace);
  const thisWeekSpaces = useAppSelector(selectThisWeekSpaces);
  const currentDate =
    currentDateSpace && stringifyDate(currentDateSpace?.timeframe.fromDate);
  const currentHabit = useAppSelector(selectCurrentHabit);
  const { fromDate, toDate } = currentHabit?.timeframe;

  const handleChange = () => {};

  return (
    <fieldset className="w-1/3">
      <input
        id="date-today"
        tabIndex={3}
        required={true}
        className="date-today sm:h-10 xl:text-xl xl:px-2 md:py-1 w-full h-6 px-1 mt-1"
        type="date"
        value={new Date().toDateInputValue()}
        min={DateTime.fromMillis(fromDate).toISODate()}
        max={new Date().toDateInputValue()}
        list="current-habit-date-list"
        onChange={handleChange}
      />
      <datalist id="current-habit-date-list">
        {currentHabit &&
          thisWeekSpaces.map(({ timeframe: { fromDate } }, idx) => (
            <option
              key={idx}
              name={`date-option-date-id-${idx}`}
              value={DateTime.fromMillis(fromDate).toISODate()}
            >
              {DateTime.fromMillis(fromDate).toISODate()}
            </option>
          ))}
      </datalist>
    </fieldset>
  );
};
