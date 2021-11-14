import React from "react";

import {sanitiseForDataList} from 'app/utils';
//   updatedMinAndMaxForCurrentHabit,
//   changedDate,
//   newDate,
// } from "../../../../../../assets/scripts/controller";

export const DateSelector = function () {
  return (
      <fieldset className="w-1/3">
        <input
          id="date-today"
          tabIndex="3"
          required
          className="date-today sm:h-10 xl:text-xl xl:px-2 md:py-1 w-full h-6 px-1 mt-1"
          type="date"
          value={'DateStore.currentDate()'}
          min={'minDate && minDate.toLocaleString()'}
          max={'String(todaysDate)'}
          list="current-habit-date-list"
        />
        <datalist id="current-habit-date-list">
          {/* {HabitStore.current() &&
            DateStore.listForHabit().map((dateElement) =>
              m("option", {
                value: sanitiseForDataList(dateElement),
                name: `date-option-date-id-${dateElement.id}`,
              })
            )} */}
        </datalist>
      </fieldset>
    )
  };