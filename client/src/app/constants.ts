export const positiveCol = "#93cc96";
export const positiveColLighter = "#edd837";
export const negativeCol = "#f2aa53";
export const parentPositiveBorderCol = "#93cc97";
export const noNodeCol = "#888";
export const neutralCol = "#DADECD";

export const DB_DATE_ID_OFFSET = import.meta.env.PROD ? 5 : 3; // Accounts for the starting ID of the date relation in the DB, which is not stored locally.
export const HABIT_DATE_BACKGROUND_PERSISTENCE_INTERVAL = 15; // seconds

export const API_RESPONSE_CODE_FLASH_MESSAGES = {
  201: "The habit was created successfully.",
  500: "Something went wrong on the server.",
  204: "The habit was deleted successfully.",
  400: "Bad Request: There may have been something wrong with your input.",
  404: "No records available for this date.",
  422: "Unprocessable entity: There may have been something wrong with your input.",
  499: "This is a demo app, and you can only add the 5 domains given to you. Please choose from the the pill buttons (to the lower left)",
};
