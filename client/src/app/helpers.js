export const handleErrorType = function (err, type = "warning") {
  const response = err.response?.status
    ? err.response.data.message || messages[Number(err.response.status)] // Allow server side validation message first
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
