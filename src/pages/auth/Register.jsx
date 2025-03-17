import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import LOGO from "@/assets/logo.png";
import { useAuthContext } from "@/context/AuthContext";

export default function Register() {
  const { register } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (!values.first_name) {
      errors.first_name = "Required";
    } else if (values.first_name.length > 15) {
      errors.first_name = "Must be 15 characters or less";
    }

    if (!values.last_name) {
      errors.last_name = "Required";
    } else if (values.last_name.length > 20) {
      errors.last_name = "Must be 20 characters or less";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be greater than 8 characters";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    validate,
  });

  const createAccount = async (e) => {
    e.preventDefault();
    setIsLoading((prevIsLoading) => true);

    const response = await register(formik.values);

    if (!response) {
      console.log("Error creating account");
      setIsLoading((prevIsLoading) => false);
      return;
    }

    setIsLoading((prevIsLoading) => false);
    setIsRegistrationSuccess((prevRegistrationSuccess) => true);
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
              {!isRegistrationSuccess && (
                <Fragment>
                  <h1 className="font-bold text-2xl tracking-tight">
                    Create account
                  </h1>
                  <form
                    className="my-4 flex flex-col space-y-4"
                    onSubmit={(e) => createAccount(e)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label
                          className="text-sm font-normal"
                          htmlFor="first-name"
                        >
                          First name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="first-name"
                          name="first_name"
                          type="text"
                          placeholder="First name"
                          className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus:bg-gray-50 focus:border-gray-300 outline-0 rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.first_name}
                        />
                        {formik.touched.first_name &&
                        formik.errors.first_name ? (
                          <p className="mt-2 text-sm text-red-500">
                            {formik.errors.first_name}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-col">
                        <label
                          className="text-sm font-normal"
                          htmlFor="last-name"
                        >
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="last-name"
                          name="last_name"
                          type="text"
                          placeholder="Last name"
                          className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus:bg-gray-50 focus:border-gray-300 outline-0 rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.last_name}
                        />
                        {formik.touched.last_name && formik.errors.last_name ? (
                          <p className="mt-2 text-sm text-red-500">
                            {formik.errors.last_name}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="text-sm font-normal"
                        htmlFor="last-name"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="last-name"
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus:bg-gray-50 focus:border-gray-300 outline-0 rounded-md"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <p className="mt-2 text-sm text-red-500">
                          {formik.errors.email}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-normal" htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus:bg-gray-50 focus:border-gray-300 outline-0 rounded-md"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <p className="mt-2 text-sm text-red-500">
                          {formik.errors.password}
                        </p>
                      ) : null}
                    </div>

                    <div className="mb-4 py-4 border-y border-dashed border-gray-300">
                      <p className="text-xs text-gray-600 leading-5">
                        By using{" "}
                        <span className="font-medium">'Create my account'</span>{" "}
                        button, you agree to our{" "}
                        <Link
                          to="/terms"
                          className="text-blue-500 hover:underline"
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-blue-500 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>

                    {!isLoading && (
                      <button
                        type="submit"
                        className="w-full font-medium text-sm py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-md cursor-pointer"
                      >
                        Create my account
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
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                      Login here
                    </Link>
                  </p>
                </Fragment>
              )}

              {isRegistrationSuccess && (
                <Fragment>
                  <h1 className="font-bold text-2xl tracking-tight text-center">
                    Account created
                  </h1>
                  <div className="my-4 flex flex-col space-y-6">
                    <p className="text-sm text-center text-gray-600">
                      Your account has been created successfully. <br />
                      You can now login to your account.
                    </p>
                    <Link
                      to="/login"
                      className="w-full font-medium text-sm text-center text-blue-500 hover:text-blue-600 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-600 decoration-dashed cursor-pointer"
                    >
                      Click here to login
                    </Link>
                  </div>
                </Fragment>
              )}
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
