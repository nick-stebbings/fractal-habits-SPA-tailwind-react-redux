import { API_RESPONSE_CODE_FLASH_MESSAGES } from "app/constants";

export const handleErrorType = function (err, type = "warning") {
  if (err?.status == 200) return err; // Not an error
  console.log("err.response?.status :>> ", err);
  const response = err?.status
    ? err.data.message || API_RESPONSE_CODE_FLASH_MESSAGES[Number(err.status)] // Allow server side validation message first
    : err;
  const opts = {
    interactive: true,
    timeout: 4000,
  };
  switch (type) {
    case "info":
      window.FlashMessage.info(response, opts);
      break;
    case "warning":
      window.FlashMessage.warning(response, opts);
      break;
    default:
      window.FlashMessage.error(response, opts);
      break;
  }
  throw err;
};

export const isTouchDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};
export const isSmallScreen = () => {
  return document.body.getBoundingClientRect().width < 768;
};

export const isSuperSmallScreen = () => {
  return document.body.getBoundingClientRect().width < 340;
};

export const debounce = function (func, delay) {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(null, args), delay);
  };
};
