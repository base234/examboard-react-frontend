import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@/api/Api";
import ExamApi from "@/api/ExamApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set up axios interceptors
  useEffect(() => {
    const token = localStorage.getItem("token");
    const examToken = localStorage.getItem("exam-token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    if (examToken) {
      ExamApi.defaults.headers.common["Authorization"] = `Bearer ${examToken}`;
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const examToken = localStorage.getItem("exam-token");
        const storedUserType = localStorage.getItem("userType");
        const storedUser = localStorage.getItem("user");
        const storedExamUser = localStorage.getItem("exam-user");
        const storedExamUserType = localStorage.getItem("exam-userType");

        console.log("Checking auth state:", {
          token,
          examToken,
          storedUserType,
          storedUser,
          storedExamUser,
          storedExamUserType
        });

        if (token && storedUserType && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setUserType(storedUserType);
          setIsAuthenticated(true);
          console.log("Regular user authenticated:", parsedUser);
        } else if (examToken && storedExamUser && storedExamUserType) {
          const parsedUser = JSON.parse(storedExamUser);
          setUser(parsedUser);
          setUserType(storedExamUserType);
          setIsAuthenticated(true);
          console.log("Exam candidate authenticated:", parsedUser);
        } else {
          console.log("No valid authentication found");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData, type) => {
    console.log("Login called with:", { userData, type });

    if (!userData || !userData.token) {
      throw new Error("Invalid user data");
    }

    try {
      // Store user data in localStorage
      if (type === "candidate") {
        localStorage.setItem("exam-user", JSON.stringify(userData));
        localStorage.setItem("exam-userType", type);
        localStorage.setItem("exam-token", userData.token);
        ExamApi.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      } else {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userType", type);
        localStorage.setItem("token", userData.token);
        Api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      }

      // Update state
      setUser(userData);
      setUserType(type);
      setIsAuthenticated(true);

      console.log("Login successful, state updated:", {
        user: userData,
        userType: type,
        isAuthenticated: true
      });
    } catch (error) {
      console.error("Login error:", error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    console.log("Logout called");

    // Clear state
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);

    // Clear localStorage
    if (userType === "candidate") {
      localStorage.removeItem("exam-user");
      localStorage.removeItem("exam-userType");
      localStorage.removeItem("exam-token");
      delete ExamApi.defaults.headers.common["Authorization"];
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("token");
      delete Api.defaults.headers.common["Authorization"];
    }

    console.log("Logout completed, state cleared");
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
