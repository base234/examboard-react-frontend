import { useEffect, useRef, useState } from "react";

import { Link, useOutletContext } from "react-router-dom";

import LOGO_ORIGINAL from "@/assets/logo.png";

export default function MobileNavbar() {
  const { user, logout } = useAuthContext();

  const { setIsSidebarOpen } = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="md:hidden pr-2 sticky top-0 flex items-center justify-between bg-white/80 border-b border-gray-200 backdrop-blur-xs">
      <div className="flex items-center">
        <button
          className="p-2 hover:text-white hover:bg-gray-500 cursor-pointer"
          onClick={() =>
            setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen)
          }
        >
          <i className="fa-solid fa-bars fa-fw"></i>
        </button>
        <img src={LOGO_ORIGINAL} alt="logo" className="w-15" />
        <h1 className="text-sm font-semibold">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          className="inline-flex items-center text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none cursor-pointer hover:opacity-70"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="px-2 pt-0.5 pb-1 text-white bg-red-500 rounded-full">
            S
          </span>
          <svg
            className="w-5 h-5 ml-1 -mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={`absolute right-0 w-48 mt-1 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg transition-all duration-150 ease-in-out origin-top transform ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 invisible"
          }`}
        >
          <div className="px-4 py-2 text-xs">
            <p className="text-gray-700 font-semibold">{user.full_name}</p>
            <p className="font-medium text-gray-500 truncate">
              {user.email}
            </p>
          </div>
          <div className="py-1 text-xs flex flex-col">
            <Link className="px-4 py-1 font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer">
              Settings
            </Link>
            <Link className="px-4 py-1 font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer">
              Help and Support
            </Link>
            <span className="px-4 py-1 font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer">
              Privacy Policy
            </span>
          </div>
          <div className="py-1 text-xs flex flex-col">
            <button
            onClick={logout}
            className="px-4 py-1 text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
