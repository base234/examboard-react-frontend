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
      const payload = payloadValue;
      const response = await Api.post("/auth/login", payload);

      console.log("Response data data user:", response.data.data);

      setUser(response.data.data);

      if (payloadValue.data.rememberMe) {
        localStorage.setItem("eb-token", response.data.token);
      } else {
        sessionStorage.setItem("eb-token", response.data.token);
      }

      if (response.data.data.user.role === "teacher") {
        navigate("/dashboard");
      }

      if (response.data.data.user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      return error;
    }
  };

  const logout = () => {
    localStorage.removeItem("eb-token");
    sessionStorage.removeItem("eb-token");
    setUser(null);
    Api.delete("/auth/logout");
    navigate("/login"); // Redirect to login page
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
      const token =
        localStorage.getItem("eb-token") || sessionStorage.getItem("eb-token");

        console.log(token);

      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await Api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
    } catch {
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
