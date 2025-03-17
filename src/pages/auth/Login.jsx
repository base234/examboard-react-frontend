import React, { useState } from "react";
import LOGO from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prevIsLoading) => true);

    const payload = {
      data: {
        email,
        password,
        rememberMe,
      },
    };

    const response = await login(payload);
    setIsLoading(false);

    // if (response) {
    //   setIsLoading(false);
    //   setError("");
    //   return;
    // } else {
    //   setIsLoading(false);
    //   setError("Invalid email or password");
    // }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-10 w-full flex flex-col justify-center">
        <img src={LOGO} alt="logo" className="w-12 mx-auto" />
        <h1 className="mt-2 text-center text-normal font-bold tracking-tight">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <div className="max-w-sm w-full mx-auto flex flex-col h-full justify-center gap-3 px-2">
              <h1 className="font-bold text-2xl tracking-tight">
                Welcome back 👋
              </h1>
              <form className="my-4 flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus:bg-gray-50 focus:border-gray-300 outline-0 rounded-md"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus:bg-gray-50 focus:border-gray-300 outline-0 rounded-md"
                />
                <div className="my-2 flex items-center justify-between">
                  <div className="w-1/2 font-medium text-gray-500 flex items-center space-x-2">
                    <input type="checkbox" id="rememberMe" name="rememberMe" />
                    <label
                      className="text-sm cursor-pointer"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="w-1/2">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-gray-400 hover:text-gray-500 hover:underline float-end rounded-lg"
                    >
                      forgot password?
                    </Link>
                  </div>
                </div>
                {!isLoading && (
                  <button
                    className="w-full font-medium text-sm py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-md cursor-pointer"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Let me in
                  </button>
                )}
                {isLoading && (
                  <button
                    className="w-full font-medium text-sm py-3 flex justify-center bg-blue-400 text-white rounded-md"
                    type="button"
                    disabled
                  >
                    <svg
                      className="size-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </button>
                )}
              </form>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
          <p className="w-full py-2 pr-2 my-2 text-xs text-center text-gray-400">
            &copy; 2025 {import.meta.env.VITE_APP_NAME}
          </p>
        </div>
      </div>
    </div>
  );
}
