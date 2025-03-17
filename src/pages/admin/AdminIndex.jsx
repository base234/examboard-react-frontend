import React, { Fragment, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import LOGO_ORIGINAL from "@/assets/logo.png";

export default function CustomerIndex() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileFlyOutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileFlyOutRef.current &&
        !profileFlyOutRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen((prevIsProfileDropdownOpen) => false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen flex">
      <div
        className={`hidden md:flex ${
          isSidebarOpen ? "w-[260px]" : "w-[50px]"
        } h-full border-r border-gray-200 flex-col bg-white duration-200 ease-in-out`}
      >
        <div
          className={`border-b border-gray-200 flex items-center ${
            isSidebarOpen ? "justify-between" : ""
          }`}
        >
          <button
            className={`px-4 py-2 hover:text-white hover:bg-gray-500 cursor-pointer`}
            onClick={() =>
              setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen)
            }
          >
            <i className="fa-solid fa-bars fa-fw"></i>
          </button>
          <div
            className={`${
              isSidebarOpen ? "w-full" : "hidden"
            } flex items-center space-x-1`}
          >
            <img src={LOGO_ORIGINAL} alt="logo" className="w-15" />
            <h1 className="text-sm font-semibold">
              {import.meta.env.VITE_APP_NAME}
            </h1>
          </div>
        </div>
        <button className="py-2 mt-3 mb-2 mx-1.5 text-sm font-medium border border-gray-300 rounded-md cursor-pointer">
          <i className="fa-solid fa-plus fa-fw"></i>{" "}
          <span className={`${isSidebarOpen ? "" : "hidden"}`}>
            New Project
          </span>
        </button>
        <div className="overflow-y-auto">
          {isSidebarOpen ? (
            <h6 className="ml-4 mt-2 mb-2 text-xs font-normal text-gray-400">
              MAIN
            </h6>
          ) : (
            <hr className="mx-1.5 mt-1 mb-3 border-gray-200" />
          )}
          <div className="flex flex-col">
            <NavLink
              to="/dashboard"
              className={`${
                location.pathname === "/dashboard"
                  ? "border-gray-400"
                  : "border-transparent"
              }
              py-3 pl-4 font-semibold text-sm text-gray-700 bg-gray-100 border-r-2 flex items-center space-x-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
              <span
                className={`absolute left-11 transition-all duration-200 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5 pointer-events-none"
                }`}
              >
                Dashboard
              </span>
            </NavLink>
            <NavLink className="py-3 pl-4 font-semibold text-sm text-gray-500 hover:text-gray-700 border-r-2 border-transparent flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
              <span
                className={`absolute left-11 transition-all duration-200 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5 pointer-events-none"
                }`}
              >
                Projects
              </span>
            </NavLink>
            <NavLink className="py-3 pl-4 font-semibold text-sm  text-gray-500 hover:text-gray-700 border-r-2 border-transparent flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <span
                className={`absolute left-11 transition-all duration-200 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5 pointer-events-none"
                }`}
              >
                Pieces
              </span>
            </NavLink>
          </div>
          {isSidebarOpen ? (
            <h6 className="ml-4 mt-8 mb-2 text-xs font-normal text-gray-400">
              RECENT PROJECTS
            </h6>
          ) : (
            <hr className="mx-1.5 mt-4 mb-3 border-gray-200" />
          )}
          <div className="flex flex-col">
            <NavLink
              className={`py-2 text-xs border-r-2 border-transparent flex ${
                isSidebarOpen ? "pl-4 space-x-1.5" : "justify-center"
              }`}
            >
              <span>&#x2022;</span>
              <span
                className={`absolute left-8 transition-all duration-200 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5 pointer-events-none"
                }`}
              >
                Shining Blogs that superheroes lov...
              </span>
            </NavLink>
            <NavLink
              className={`py-2 text-xs border-r-2 border-transparent flex ${
                isSidebarOpen ? "pl-4 space-x-1.5" : "justify-center"
              }`}
            >
              <span>&#x2022;</span>
              <span
                className={`absolute left-8 transition-all duration-200 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5 pointer-events-none"
                }`}
              >
                Shining Blogs that superheroes lov...
              </span>
            </NavLink>
            <NavLink
              className={`py-2 text-xs border-r-2 border-transparent flex ${
                isSidebarOpen ? "pl-4 space-x-1.5" : "justify-center"
              }`}
            >
              <span>&#x2022;</span>
              <span
                className={`absolute left-8 transition-all duration-200 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5 pointer-events-none"
                }`}
              >
                Shining Blogs that superheroes lov...
              </span>
            </NavLink>
          </div>
          {isSidebarOpen && (
            <Fragment>
              <hr className="my-4 border-gray-200" />
              <div className="flex flex-col">
                <NavLink className="py-2 pl-4 font-medium text-xs text-gray-500 border-r-2 border-transparent inline-flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                  <span>What's new</span>
                </NavLink>
              </div>
            </Fragment>
          )}
        </div>
        <div className="mt-auto flex flex-col">
          {isSidebarOpen ? (
            <div className="mt-2 mb-2 mx-2 py-2 px-2 text-sm bg-white shadow flex items-center space-x-2 justify-between rounded-lg">
              <div className="flex items-start space-x-1.5">
                <div>
                  <i className="fa-solid fa-user-circle fa-fw fa-2x text-gray-500"></i>
                </div>
                <div className="flex flex-col text-xs">
                  <h6 className="font-semibold">Sayan Sinha</h6>
                  <p className="text-gray-500">sayansinha5@gmail.com</p>
                </div>
              </div>
              <button
                className="p-1 bg-white border border-gray-200 rounded-md cursor-pointer"
                onClick={() =>
                  setIsProfileDropdownOpen(
                    (prevIsProfileDropdownOpen) => !prevIsProfileDropdownOpen
                  )
                }
              >
                <i className="fa-solid fa-ellipsis fa-fw"></i>
              </button>
            </div>
          ) : (
            <button
              className="px-1 py-1.5 mx-1 mb-1 bg-white shadow border border-gray-200 rounded-md cursor-pointer"
              onClick={() =>
                setIsProfileDropdownOpen(
                  (prevIsProfileDropdownOpen) => !prevIsProfileDropdownOpen
                )
              }
            >
              <i className="fa-solid fa-user-circle fa-fw fa-xl text-gray-500"></i>
            </button>
          )}
        </div>
        <div
          ref={profileFlyOutRef}
          className={`${
            isSidebarOpen
              ? `${
                  isProfileDropdownOpen
                    ? "opacity-100 translate-y-4"
                    : "opacity-0 translate-y-6"
                } absolute w-60 py-1.5 px-1 bottom-20 left-2.5 bg-white/95 border-gray-200`
              : `${
                  isProfileDropdownOpen
                    ? "opacity-100 translate-x-4"
                    : "opacity-0 translate-x-2"
                } absolute w-44 py-1 bottom-1 left-10 bg-white border-gray-300 shadow-lg`
          } border rounded-lg duration-200 ease-in-out`}
        >
          <div className="px-2 flex flex-col">
            <h1 className="text-xs font-semibold text-gray-600">Sayan Sinha</h1>
            <p className="text-xs text-gray-500">sayansinha5@gmail.com</p>
          </div>
          <hr className="my-1 border-gray-100" />
          <div className="flex flex-col text-xs">
            <button className="py-1 px-2 font-medium text-left text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center space-x-1.5 cursor-pointer">
              <span>Settings</span>
            </button>
            <button className="py-1 px-2 font-medium text-left text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
              <span>Help and Support</span>
            </button>
            <button className="py-1 px-2 font-medium text-left text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
              <span>Privacy Policy</span>
            </button>
            <hr className="my-0.5 border-gray-100" />
            <button className="py-1 px-2 font-medium text-left text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center cursor-pointer">
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Version Sidebar */}
      <div
        className={`z-40 absolute md:hidden transition-opacity duration-200 ease-in-out ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } h-screen w-full bg-black/50 backdrop-blur-xs`}
        onClick={() =>
          setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen)
        }
      ></div>
      <div
        className={`z-50 absolute md:hidden ${
          isSidebarOpen ? "ml-0" : "-ml-[240px]"
        } w-[240px] h-full border-r border-gray-200 flex flex-col bg-gray-50 duration-150 ease-in-out`}
      >
        <div className="pr-2 border-b border-gray-200 flex items-center justify-between">
          <button
            className="p-2 hover:text-white hover:bg-gray-500 cursor-pointer"
            onClick={() =>
              setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen)
            }
          >
            <i className="fa-solid fa-bars fa-fw"></i>
          </button>
          <div className="w-full flex items-center space-x-1">
            <img src={LOGO_ORIGINAL} alt="logo" className="w-15" />
            <h1 className="text-sm font-semibold">
              {import.meta.env.VITE_APP_NAME}
            </h1>
          </div>
        </div>
        <button className="py-2 mt-3 mb-2 mx-2 text-xs font-medium border border-gray-300 rounded-md cursor-pointer">
          <i className="fa-solid fa-plus fa-fw"></i> <span>New Project</span>
        </button>
        <div className="overflow-y-auto">
          <h6 className="ml-4 mt-2 mb-2 font-normal text-xs tracking-wide text-gray-400">
            MAIN
          </h6>
          <div className="flex flex-col">
            <NavLink className="py-2 pl-4 font-semibold text-xs bg-gray-200 border-r-2 border-transparent flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
              <span>Dashboard</span>
            </NavLink>
            <NavLink className="py-2 pl-4 font-semibold text-xs border-r-2 border-transparent flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
              <span>Projects</span>
            </NavLink>
            <NavLink className="py-2 pl-4 font-semibold text-xs border-r-2 border-transparent flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <span>Pieces</span>
            </NavLink>
          </div>
          <h6 className="ml-4 mt-4 mb-1 font-normal text-xs tracking-wide text-gray-400">
            RECENT PROJECTS
          </h6>
          <div className="flex flex-col">
            <NavLink className="py-2 pl-4 font-medium text-xs border-r-2 border-transparent flex space-x-1.5">
              <span>&#x2022;</span>
              <span className="truncate">
                Shining Blogs that superheroes love the way they do it
              </span>
            </NavLink>
            <NavLink className="py-2 pl-4 font-medium text-xs border-r-2 border-transparent flex space-x-1.5">
              <span>&#x2022;</span>
              <span className="truncate">
                Shining Blogs that superheroes love the way they do it
              </span>
            </NavLink>
            <NavLink className="py-2 pl-4 font-medium text-xs border-r-2 border-transparent flex space-x-1.5">
              <span>&#x2022;</span>
              <span className="truncate">
                Shining Blogs that superheroes love the way they do it
              </span>
            </NavLink>
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="flex flex-col">
            <NavLink className="py-2 pl-4 font-medium text-xs text-gray-500 border-r-2 border-transparent inline-flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>

              <span>What's new</span>
            </NavLink>
          </div>
        </div>
        <p className="mt-auto px-4 pt-2 pb-2.5 text-xs text-gray-400">
          v1.0 &copy; {import.meta.env.VITE_APP_NAME} 2025
        </p>
      </div>
      <div
        className={`w-full ${
          isSidebarOpen ? "md:w-[calc(100%-260px)]" : "md:w-[calc(100%-50px)]"
        } h-full overflow-y-auto bg-gray-50`}
      >
        <Outlet context={{ setIsSidebarOpen }} />
      </div>
    </div>
  );
}
