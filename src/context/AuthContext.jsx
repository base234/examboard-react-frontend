import React, { createContext, useContext, useState, useEffect } from "react";
import { Router, useNavigate } from "react-router-dom";
import Api from "@/Api/Api";
import Loader from "../components/Loader";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const router = Router;

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem("eb-token") || sessionStorage.getItem("eb-token");
    const examToken = localStorage.getItem("exam-token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    if (examToken) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${examToken}`;
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const register = async (values) => {
    try {
      const payload = {
        data: values,
      };
      const response = await Api.post("/auth/register", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (userData, type = "user") => {
    try {
      if (type === "candidate") {
        // Handle exam candidate login
        localStorage.setItem("exam-token", userData.token);
        localStorage.setItem("exam-user", JSON.stringify(userData));
        localStorage.setItem("exam-userType", type);
        setUser(userData);
        setUserType(type);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        // Handle regular user login
        const response = await Api.post("/auth/login", userData);
        const { token, data, status, message } = response.data;

        if (status === "success") {
          setUser(data);
          setUserType(data.role);
          setIsAuthenticated(true);

          if (userData.data.rememberMe) {
            localStorage.setItem("eb-token", token);
            sessionStorage.removeItem("eb-token");
          } else {
            sessionStorage.setItem("eb-token", token);
            localStorage.removeItem("eb-token");
          }

          Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          if (data.role === "teacher") {
            navigate("/dashboard");
          } else if (data.role === "admin") {
            navigate("/admin/dashboard");
          } else if (data.role === "writer") {
            navigate("/writer/dashboard");
          }

          return { success: true, message };
        } else {
          return { success: false, message: message || "Invalid credentials" };
        }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Invalid credentials" };
    }
  };

  const logout = async () => {
    try {
      if (userType === "candidate") {
        localStorage.removeItem("exam-token");
        localStorage.removeItem("exam-user");
        localStorage.removeItem("exam-userType");
      } else {
        await Api.delete("/auth/logout");
        localStorage.removeItem("eb-token");
        sessionStorage.removeItem("eb-token");
      }
      delete Api.defaults.headers.common["Authorization"];
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await Api.post("/auth/forgot-password", { email });
    } catch (error) {
      console.log(error);
    }
  };

  const changePassword = async (token, password) => {
    try {
      await Api.post(`/auth/reset-password`, { token, password });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("eb-token") || sessionStorage.getItem("eb-token");
      const examToken = localStorage.getItem("exam-token");
      const examUser = localStorage.getItem("exam-user");
      const examUserType = localStorage.getItem("exam-userType");

      if (examToken && examUser && examUserType) {
        // Handle exam candidate
        const parsedUser = JSON.parse(examUser);
        setUser(parsedUser);
        setUserType(examUserType);
        setIsAuthenticated(true);
      } else if (token) {
        // Handle regular user
        const response = await Api.get("/me");
        setUser(response.data.data);
        setUserType(response.data.data.role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("eb-token");
      sessionStorage.removeItem("eb-token");
      localStorage.removeItem("exam-token");
      localStorage.removeItem("exam-user");
      localStorage.removeItem("exam-userType");
      delete Api.defaults.headers.common["Authorization"];
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    fetchUser,
    forgotPassword,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
