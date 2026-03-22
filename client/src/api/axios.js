import axios from "axios";

const api = axios.create({
  // "http://91.99.172.131:3000/api/" 
  // http://localhost:3000
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;