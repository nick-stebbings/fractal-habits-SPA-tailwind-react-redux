const BASE_URL = import.meta.env.PROD
  ? "https://api.habfract.life"
  : "http://localhost:9292";

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
    if ([500, 404].includes(res?.response?.status)) return res?.response; // Already handled with modal
    return handleErrorType(res); // Handle with a flash message
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
    destroy: (attrs) => {
      if (Object.values(attrs).length > 1) {
        // Account for many-many relationships
        return axios.delete(`${basePath}/${attrs.id1}/${attrs.id2}`);
      } else {
        return axios.delete(`${basePath}/${attrs.id}`);
      }
    },
    show_one: ({ id }) => axios.get(`${basePath}/${id}`),
    replace: (id, update) => axios.put(`${basePath}/${id}`, update),
  };
}

export { clientRoutes };

export default BASE_URL;
