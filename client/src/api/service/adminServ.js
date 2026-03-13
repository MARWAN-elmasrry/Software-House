import api from "../axios.js";

export const GetContact = async () => {
  try {
    const response = await api.get("/contact")
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Error sending message";
  }
}