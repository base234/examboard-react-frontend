import React, { Fragment, useEffect, useRef, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import Api from "@/api/Api.js";
import { NavLink } from "react-router-dom";

export default function Students() {
  const [showAddNewStudentModal, setShowAddNewStudentModal] = useState(false);

  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const addNewStudent = (e) => {
    e.preventDefault();

    const payload = {
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
    };
    Api.post("/students", payload).then(() => {
      setShowAddNewStudentModal(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      fetchStudents();
    });
  };

  const fetchStudents = () => {
    Api.get("/students").then((response) => {
      setStudents(response.data.data);
    });
  };

  return (
    <Fragment>
      <SmartModal
        open={showAddNewStudentModal}
        onClose={() =>
          setShowAddNewStudentModal(
            (showAddNewStudentModal) => (showAddNewStudentModal = false)
          )
        }
        header="New Student"
        showHeader={true}
        size="md"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        <div className="flex items-center space-x-2">
          <div className="w-1/2 flex flex-col">
            <label htmlFor="first_name" className="text-sm font-medium">
              <span>First Name</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-1/2 flex flex-col">
            <label htmlFor="last_name" className="text-sm font-medium">
              <span>Last Name</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full mt-4 flex flex-col">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            className="mt-6 px-4 pt-3.5 pb-4 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
            onClick={addNewStudent}
          >
            <i className="fa-solid fa-user-plus fa-fw"></i>{" "}
            <span>Add New Student</span>
          </button>
        </div>
      </SmartModal>

        <div className="sticky top-0 flex flex-col">
          <MobileNavbar />
          <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
            <h2 className="text-lg md:text-2xl font-bold tracking-tight">
              Students
            </h2>
            {students.length > 0 && (
              <button
                className="px-4 py-1.5 font-semibold text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setShowAddNewStudentModal(true)}
              >
                <i className="fa-solid fa-user-plus fa-fw"></i>{" "}
                <span className="pr-1">New</span>
              </button>
            )}
          </div>
          <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center">
                <i className="fa-solid fa-filter"></i>
                <span className="mx-2 underline underline-offset-4 decoration-dashed">
                  Filter
                </span>
              </button>
            </div>
            <div className="flex items-center border border-gray-200 rounded-md group hover:border-gray-300 focus-within:border-gray-400 focus-within:hover:border-gray-400">
              <label htmlFor="search-student" className="pl-2">
                <i className="fa-solid fa-magnifying-glass fa-fw text-gray-300"></i>
              </label>
              <input
                id="search-student"
                type="text"
                className="w-40 lg:w-60 py-1.5 px-2 text-sm text-gray-600 rounded-md outline-none"
                placeholder="Search Student..."
              />
            </div>
          </div>
          <div className="px-2 sm:px-4 lg:px-10 py-2 font-semibold text-xs md:text-sm text-left text-gray-400 bg-gray-50 border-y border-gray-200 grid grid-cols-12 gap-2">
            <div className="col-span-1">#</div>
            <div className="col-span-2">ID</div>
            <div className="col-span-3">NAME</div>
            <div className="col-span-3">EMAIL</div>
            <div className="col-span-3"></div>
          </div>
        </div>

        {students.length === 0 && (
          <div className="w-full mx-4 mt-6 p-10 bg-white border border-gray-200 text-center rounded-lg">
            <p className="text-gray-500">Start by adding students</p>
            <button
              className="mt-4 mx-auto pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
              onClick={() => setShowAddNewStudentModal(true)}
            >
              <i className="fa-solid fa-plus fa-fw"></i>{" "}
              <span>New Student</span>
            </button>
          </div>
        )}

        {students.length > 0 && (
          <div className="w-full">
            {students.map((student, index) => (
              <div
                key={index}
                className="px-2 sm:px-4 lg:px-10 text-xs md:text-sm text-left text-gray-600 border-b border-gray-200 hover:bg-yellow-50 grid grid-cols-12 gap-2"
              >
                <div className="col-span-1 py-2 font-semibold">{index + 1}</div>
                <div className="col-span-2 py-2">STU4567</div>
                <NavLink
                  to={`/students/id`}
                  className="col-span-3 py-2 hover:underline decoration-gray-400/60 underline-offset-4"
                >
                  {student.full_name}
                </NavLink>
                <div className="col-span-3 py-2">{student.email}</div>
                <div className="col-span-3 py-2 flex items-center justify-end space-x-2">
                  <button className="text-gray-300 hover:text-gray-500 cursor-pointer">
                    <i className="fa-solid fa-edit fa-fw"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </Fragment>
  );
}
