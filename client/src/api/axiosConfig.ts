import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    error.response.status === 401 &&
      console.log("Unauthorized! Please log in.");
    return Promise.reject(error);
  }
);

export default axiosInstance;
