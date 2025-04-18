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
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem("eb-token") || sessionStorage.getItem("eb-token");
    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
      return response.data; // Return the response data
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (payloadValue) => {
    try {
      const response = await Api.post("/auth/login", payloadValue);
      const { token, data, status, message } = response.data;

      if (status === "success") {
        // Set user data
        setUser(data);

        // Store token based on remember me
        if (payloadValue.data.rememberMe) {
          localStorage.setItem("eb-token", token);
          sessionStorage.removeItem("eb-token"); // Clear session storage
        } else {
          sessionStorage.setItem("eb-token", token);
          localStorage.removeItem("eb-token"); // Clear local storage
        }

        // Set token in axios defaults
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Navigate based on role
        if (data.role === "teacher") {
          navigate("/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.role === "writer") {
          navigate("/writer/dashboard");
        }

        return { success: true, message };
      } else {
        return {
          success: false,
          message: message || "Invalid credentials"
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials"
      };
    }
  };

  const logout = async () => {
    try {
      await Api.delete("/auth/logout");
    } finally {
      localStorage.removeItem("eb-token");
      sessionStorage.removeItem("eb-token");
      delete Api.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
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

      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await Api.get("/me");
      setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem("eb-token");
      sessionStorage.removeItem("eb-token");
      delete Api.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        forgotPassword,
        changePassword,
        isLoading,
      }}
    >
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
