import { DateTime, Duration } from "luxon";

export const createInterval = (
  startRelative = 0,
  numberOfDays = 1,
  startDate = null
) => {
  startDate ||= DateTime.local().startOf("day");
  return {
    // startRelative is days relative to startDate (negative)
    timeframe: {
      fromDate: startDate - Duration.fromObject({ days: -startRelative }),
      toDate:
        startDate + Duration.fromObject({ days: startRelative + numberOfDays }),
      length: Duration.fromObject({ days: numberOfDays }).toString(),
    },
  };
};

export const weekOfDaySpaces = (startRelative = 0) =>
  Array.from("1234567")
    .map((_, idx) => createInterval(startRelative - idx, 1))
    .reverse();
