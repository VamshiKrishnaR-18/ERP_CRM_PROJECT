import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL + "/api" || "http://localhost:3000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.request.use(
  async (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log(
        "Token expired or unauthorized. Redirecting to login page..."
      );
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
