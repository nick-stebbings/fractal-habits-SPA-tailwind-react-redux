const BASE_URL = "http://localhost:9292"; // "https://api.habfract.life";

import axios from "axios";

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common.Accept = "application/json;charset=utf-8";
axios.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";
// axios.interceptors.response.use((res) => res, handleAndRethrow);

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
