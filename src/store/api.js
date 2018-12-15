import axios from "axios";

export const api = axios.create({
  baseURL: "https://conduit.productionready.io/api"
});

export function setToken(token) {
  api.defaults.headers.common["Authorization"] = `Token ${token}`;
}

export function clearToken() {
  delete api.defaults.headers.common["Authorization"];
}
