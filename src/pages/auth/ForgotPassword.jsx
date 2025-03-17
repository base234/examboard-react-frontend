import React from "react";
import LOGO from "@/assets/logo.png";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 w-full flex justify-center">
        <img src={LOGO} alt="logo" className="w-32 mx-auto" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <div className="max-w-sm w-full mx-auto flex flex-col h-full justify-center gap-3 px-2">
              <h1 className="font-bold text-2xl tracking-tight">
                Forgot Password?
              </h1>
              <p className="mt-2 text-sm text-gray-500">If your account exists, you will receive an email with an instructions to reset your password</p>
              <form className="mt-4 mb-2 flex flex-col space-y-6">
                <div className="flex flex-col">
                  <label
                    className="text-sm font-normal"
                    htmlFor="email-address"
                  >
                    Enter your email to continue
                  </label>
                  <input
                    id="email-address"
                    type="email"
                    placeholder="Email"
                    className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus:bg-gray-50 focus:border-gray-300 outline-0 rounded-md"
                  />
                </div>

                <button className="w-full font-medium text-sm py-3 text-white bg-blue-500 hover:bg-blue-400 space-x-2 rounded-md cursor-pointer">
                  <i className="fa-solid fa-paper-plane fa-fw"></i>
                  <span>Send</span>
                </button>
              </form>
              <Link
                to="/login"
                className="py-3 text-sm text-center border border-blue-100 text-blue-500 hover:bg-blue-50 space-x-2 rounded-md cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left-long fa-fw"></i>
                <span>Back to login</span>
              </Link>
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
