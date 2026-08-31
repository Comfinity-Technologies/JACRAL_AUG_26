import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jacral_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401s (token expiry)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If it's a 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("jacral_refresh_token");
      
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
          );
          
          const { access_token, refresh_token: new_refresh_token } = response.data;
          
          localStorage.setItem("jacral_access_token", access_token);
          localStorage.setItem("jacral_refresh_token", new_refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh token is invalid/expired
          localStorage.removeItem("jacral_access_token");
          localStorage.removeItem("jacral_refresh_token");
          localStorage.removeItem("jacral_user");
          window.location.href = "/login";
        }
      } else {
        // No refresh token available, logout
        localStorage.removeItem("jacral_access_token");
        localStorage.removeItem("jacral_refresh_token");
        localStorage.removeItem("jacral_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);