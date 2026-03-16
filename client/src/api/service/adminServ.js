import api from "../axios.js";

export const GetContact = async () => {
  try {
    const response = await api.get("/contact")
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Error sending message";
  }
}

export const getStats = async () => {
  try {
    const res = await api.get("/projects/stats");
    
    // axios already parses JSON — data is in res.data, NOT res.json()
    if (!res.data.success) {
      throw new Error(res.data.error);
    }

    return res.data;
  } catch (error) {
    console.error("Error in getStats:", error);
    throw error;
  }
};
 