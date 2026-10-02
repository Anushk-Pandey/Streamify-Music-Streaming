import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api");

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor to attach clerk or demo user identity
axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("streamify_user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.clerkId) {
        config.headers["x-user-id"] = user.clerkId;
        config.headers["x-user-name"] = user.fullName;
        config.headers["x-user-email"] = user.email || "";
        config.headers["x-user-role"] = user.role || "user";
      }
    } catch (e) { }
  }
  return config;
});

export default axiosInstance;
