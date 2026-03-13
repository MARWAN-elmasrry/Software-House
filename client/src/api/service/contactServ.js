import api from "../axios.js";

export const PostContact = async (data) => {
  try {
    const response = await api.post("/contact", data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Error sending message";
  }
}