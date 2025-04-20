import axios from "axios";

const ExamApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  timeout: 5000,
});

// Request interceptor for exam API
ExamApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("exam-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for exam API
ExamApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Only redirect if we're not on the login page
        if (window.location.pathname !== "/exams/login") {
          localStorage.removeItem("exam-token");
          localStorage.removeItem("exam-user");
          localStorage.removeItem("exam-userType");
          window.location.href = "/exams/login";
        }
      }
      // Handle other errors
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default ExamApi;
