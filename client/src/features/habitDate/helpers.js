import { DateTime } from "luxon";
Date.prototype.toDateInputValue = function () {
  const local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};
export const stringifyDate = (unixTs) =>
  DateTime.fromMillis(unixTs).toLocaleString({
    month: "short",
    weekday: "short",
    day: "numeric",
  });

// export const sanitiseForDataList = function (date) {
//   return typeof date === "object" && typeof date.h_date === "string"
//     ? date.h_date.split(" ")[0]
//     : new Date().toDateInputValue();
// };
