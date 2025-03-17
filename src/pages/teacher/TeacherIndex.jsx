import React, { Fragment, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import LOGO_ORIGINAL from "@/assets/logo.png";
import { useAuthContext } from "@/context/AuthContext";

export default function TeacherIndex() {
  const { user, logout } = useAuthContext();
  console.log(user);

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
          isSidebarOpen ? "w-[260px]" : "w-[56px]"
        } h-full border-r border-gray-200 flex-col bg-white duration-200 ease-in-out`}
      >
        <div
          className={`border-b border-gray-200 flex items-center ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          <div
            className={`pl-4 py-3 ${
              isSidebarOpen ? "w-full" : "hidden"
            } flex items-center space-x-2`}
          >
            <img src={LOGO_ORIGINAL} alt="logo" className="w-6" />
            <h1 className="text-base font-semibold">
              {import.meta.env.VITE_APP_NAME}
            </h1>
          </div>
          <button
            className={`px-5 py-3 text-gray-500 hover:text-white hover:bg-gray-500 cursor-pointer`}
            onClick={() =>
              setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen)
            }
          >
            <i className="fa-solid fa-bars fa-fw"></i>
          </button>
        </div>
        <div className="overflow-y-auto">
          <div className="mt-3 flex flex-col px-2 space-y-1">
            <NavLink
              to="/dashboard"
              className={`${
                location.pathname === "/dashboard"
                  ? "bg-gray-50 text-gray-800 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-2 font-medium border rounded-md flex items-center space-x-2`}
            >
              <i className="uil uil-create-dashboard text-xl"></i>
              <span className={`text-sm ${isSidebarOpen ? "" : "hidden"}`}>
                Dashboard
              </span>
            </NavLink>
            <NavLink
              to="/students"
              className={`${
                location.pathname === "/students"
                  ? "bg-gray-50 text-gray-800 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-2 font-medium border rounded-lg flex items-center space-x-2`}
            >
              <i className="uil uil-users-alt text-xl"></i>
              <span className={`text-sm ${isSidebarOpen ? "" : "hidden"}`}>
                Students
              </span>
            </NavLink>
            <NavLink
              to="/batches"
              className={`${
                location.pathname === "/batches"
                  ? "bg-gray-50 text-gray-800 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-2 font-medium border rounded-lg flex items-center space-x-2`}
            >
              <i className="uil uil-object-group text-xl"></i>
              <span className={`text-sm ${isSidebarOpen ? "" : "hidden"}`}>
                Batches
              </span>
            </NavLink>
            <NavLink
              to="/question-bank"
              className={`${
                location.pathname === "/question-bank"
                  ? "bg-gray-50 text-gray-800 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-2 font-medium border rounded-lg flex items-center space-x-2`}
            >
              <i className="uil uil-university text-xl"></i>
              <span className={`text-sm ${isSidebarOpen ? "" : "hidden"}`}>
                Question Bank
              </span>
            </NavLink>
            <NavLink
              to="/paper-builder"
              className={`${
                location.pathname === "/paper-builder"
                  ? "bg-gray-50 text-gray-800 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-2 font-medium border rounded-lg flex items-center space-x-2`}
            >
              <i className="uil uil-file-question-alt text-xl"></i>
              <span className={`text-sm ${isSidebarOpen ? "" : "hidden"}`}>
                Paper Builder
              </span>
            </NavLink>
            <NavLink
              to="/assessments"
              className={`${
                location.pathname === "/assessments"
                  ? "bg-gray-50 text-gray-800 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-2 font-medium border rounded-lg flex items-center space-x-2`}
            >
              <i className="uil uil-clipboard-alt text-xl"></i>
              <span className={`text-sm ${isSidebarOpen ? "" : "hidden"}`}>
                Assessments
              </span>
            </NavLink>
            <NavLink
              to="/reports"
              className={`${
                location.pathname === "/reports"
                  ? "bg-gray-50 text-gray-800 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-2 font-medium border rounded-lg flex items-center space-x-2`}
            >
              <i className="uil uil-chart-pie text-2xl"></i>
              <span className={`text-sm ${isSidebarOpen ? "" : "hidden"}`}>
                Reports
              </span>
            </NavLink>
          </div>
        </div>
        <div className="mt-auto px-1 flex flex-col">
          {isSidebarOpen ? (
            <div className="mt-2 mb-2 py-2 px-2 text-sm bg-white border border-gray-200 flex items-center space-x-2 justify-between rounded-lg">
              <div className="flex items-start space-x-1.5">
                <div>
                  <i className="fa-solid fa-user-circle fa-fw fa-2x text-gray-500"></i>
                </div>
                <div className="flex flex-col text-xs">
                  <h6 className="font-semibold">{user.full_name}</h6>
                  <p className="text-gray-500 truncate">{user.email}</p>
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
              className="px-1 py-2 mx-0.5 mb-1 bg-white border border-gray-200 hover:border-gray-300 rounded-md bg-gradient-to-t from-gray-100 to-white cursor-pointer"
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
                } absolute w-60 pt-2 pb-1 bottom-20 left-2.5 bg-white/95 border-gray-200`
              : `${
                  isProfileDropdownOpen
                    ? "opacity-100 translate-x-4"
                    : "opacity-0 translate-x-2"
                } absolute w-52 pt-1.5 pb-1 bottom-1 left-12 bg-white border-gray-300 shadow-lg`
          } border rounded-lg duration-200 ease-in-out`}
        >
          <div className="px-3 flex flex-col">
            <h1 className="text-xs font-semibold text-gray-600">{user.full_name}</h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <hr className="my-1 border-gray-100" />
          <div className="flex flex-col text-xs">
            <button className="py-1 px-3 font-medium text-left text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center space-x-1.5 cursor-pointer">
              <span>Settings</span>
            </button>
            <button className="py-1 px-3 font-medium text-left text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
              <span>Help and Support</span>
            </button>
            <button className="py-1 px-3 font-medium text-left text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
              <span>Privacy Policy</span>
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={logout}
              className="py-1 px-3 font-medium text-left text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center cursor-pointer"
            >
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
        <div className="py-3 px-4 flex items-center justify-between">
          {/* <button
            className="p-2 hover:text-white hover:bg-gray-500 cursor-pointer"
            onClick={() =>
              setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen)
            }
          >
            <i className="fa-solid fa-bars fa-fw"></i>
          </button> */}
          <div className="w-full flex items-center space-x-2">
            <img src={LOGO_ORIGINAL} alt="logo" className="w-5" />
            <h1 className="text-sm font-semibold">
              {import.meta.env.VITE_APP_NAME}
            </h1>
          </div>
        </div>
        <div className="mt-2 overflow-y-auto">
          <div className="flex flex-col space-y-1">
            <NavLink
              to="/dashboard"
              className={`${
                location.pathname === "/dashboard"
                  ? "bg-gray-100 text-gray-900 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-4 font-medium border-y flex items-center space-x-2`}
            >
              <i className="uil uil-create-dashboard text-xl"></i>
              <span className="text-xs">Dashboard</span>
            </NavLink>
            <NavLink
              to="/batches"
              className={`${
                location.pathname === "/batches"
                  ? "bg-gray-100 text-gray-900 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-4 font-medium border-y flex items-center space-x-2`}
            >
              <i className="uil uil-object-group text-xl"></i>
              <span className="text-xs">Batches</span>
            </NavLink>
            <NavLink
              to="/question-bank"
              className={`${
                location.pathname === "/question-bank"
                  ? "bg-gray-100 text-gray-900 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-4 font-medium border-y flex items-center space-x-2`}
            >
              <i className="uil uil-university text-xl"></i>
              <span className="text-xs">Question Bank</span>
            </NavLink>
            <NavLink
              to="/paper-builder"
              className={`${
                location.pathname === "/paper-builder"
                  ? "bg-gray-100 text-gray-900 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-4 font-medium border-y flex items-center space-x-2`}
            >
              <i className="uil uil-file-question-alt text-xl"></i>
              <span className="text-xs">Paper Builder</span>
            </NavLink>
            <NavLink
              to="/assessments"
              className={`${
                location.pathname === "/assessments"
                  ? "bg-gray-100 text-gray-900 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-4 font-medium border-y flex items-center space-x-2`}
            >
              <i className="uil uil-clipboard-alt text-xl"></i>
              <span className="text-xs">Assessments</span>
            </NavLink>
            <NavLink
              to="/reports"
              className={`${
                location.pathname === "/reports"
                  ? "bg-gray-100 text-gray-900 border-gray-200 cursor-default"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent cursor-pointer"
              }
              py-1 px-4 font-medium border-y flex items-center space-x-2`}
            >
              <i className="uil uil-chart-pie text-xl"></i>
              <span className="text-xs">Reports</span>
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
