const BASE_URL = "http://localhost:9292"; //
// const BASE_URL = "https://api.habfract.life";

import axios from "axios";
import { handleErrorType } from "app/helpers";

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common.Accept = "application/json;charset=utf-8";
axios.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";
axios.interceptors.response.use(
  (res) => {
    if (res?.status == 200) return res; // Not an error
    return handleErrorType(res);
  },
  (res) => {
    if (res?.status == 500) return res; // Already handled with modal
    return handleErrorType(res);
  }
);

// Indicates whether or not cross-site Access-Control requests
// should be made using credentials
axios.defaults.withCredentials = true;

function clientRoutes(basePath) {
  return {
    create: (attrs) => axios.post(basePath, JSON.stringify(attrs)),
    show_all: () => axios.get(basePath),
    update: (id, update) => axios.patch(`${basePath}/${id}`, update),
    destroy: ({ id }) => axios.delete(`${basePath}/${id}`),
    show_one: ({ id }) => axios.get(`${basePath}/${id}`),
    replace: (id, update) => axios.put(`${basePath}/${id}`, update),
  };
}

export { clientRoutes };

export default BASE_URL;
