import axios from "axios";

const api = axios.create({
  baseURL: "http://91.99.172.131:3000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;