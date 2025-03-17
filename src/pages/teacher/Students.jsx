import React, { Fragment, useEffect, useRef, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import Api from "@/api/Api.js";

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

      <MobileNavbar />
      <div className="mt-2 mb-20 px-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Students</h2>
            {students.length > 0 && (
              <button
                className="px-4 pt-2 pb-2.5 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setShowAddNewStudentModal(true)}
              >
                <i className="fa-solid fa-user-plus fa-fw"></i>{" "}
                <span>Add New</span>
              </button>
            )}
          </div>

          {students.length === 0 && (
            <div className="w-full mt-6 p-10 bg-white border border-gray-200 text-center rounded-lg">
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
            <div className="w-full mt-6 p-4 bg-white border border-gray-200 rounded-lg">
              {students.map((student, index) => (
                <Fragment key={student.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-2">
                      <p>{index + 1}.</p>
                      <div>
                        <h6 className="font-medium text-gray-600">
                          {student.full_name}
                        </h6>
                        <p className="mt-1 text-sm text-gray-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  {students.length !== index + 1 && (
                    <hr className="my-2 border-gray-200" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
