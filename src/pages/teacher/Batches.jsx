import React, { Fragment, useEffect, useRef, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import Api from "@/api/Api.js";
import { NavLink } from "react-router-dom";

export default function Batches() {
  const [showAddNewBatchModal, setShowAddNewBatchModal] = useState(false);

  const [batches, setBatches] = useState([]);

  const [schoolTypes, setSchoolTypes] = useState([]);
  const [schoolLevels, setSchoolLevels] = useState([]);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [batchName, setBatchName] = useState("");
  const [batchDescription, setBatchDescription] = useState("");
  const [schoolTypeId, setSchoolTypeId] = useState("");
  const [schoolLevelId, setSchoolLevelId] = useState("");
  const [schoolClassId, setSchoolClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    fetchBatches();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (showAddNewBatchModal) {
      setBatchName("");
      setBatchDescription("");
      setSchoolTypeId("");
      setSchoolLevelId("");
      setSchoolClassId("");
    }
  }, [showAddNewBatchModal]);

  const fetchBatches = () => {
    Api.get("/batches").then((response) => {
      setBatches(response.data.data);
    });
  };

  useEffect(() => {
    Api.get("/schools").then((response) => {
      setSchoolTypes(response.data.data);
    });
  }, []);

  const handleSchoolTypeChange = (e) => {
    setSchoolTypeId(e.target.value);
    fetchSchoolLevels(e.target.value);
  };

  const fetchSchoolLevels = (schoolTypeId) => {
    setSchoolLevelId("");
    setSchoolClassId("");

    Api.get(`/schools/${schoolTypeId}/levels`).then((response) => {
      setSchoolLevels(response.data.data);
    });
  };

  const handleSchoolLevelChange = (e) => {
    setSchoolLevelId(e.target.value);
    fetchSchoolClasses(e.target.value);
  };

  const fetchSchoolClasses = (schoolLevelId) => {
    setSchoolClassId("");

    Api.get(`/schools/${schoolTypeId}/levels/${schoolLevelId}/classes`).then(
      (response) => {
        setSchoolClasses(response.data.data);
      }
    );
  };

  const handleSchoolClassChange = (e) => {
    setSchoolClassId(e.target.value);
  };

  const fetchSubjects = () => {
    Api.get("/subjects").then((response) => {
      setSubjects(response.data.data);
    });
  };

  const addNewBatch = (e) => {
    e.preventDefault();

    const payload = {
      data: {
        school_type_id: schoolTypeId,
        school_level_id: schoolLevelId,
        school_class_id: schoolClassId,
        subject_id: subjectId,
        name: batchName,
        description: batchDescription,
      },
    };

    Api.post("/batches", payload).then(() => {
      setShowAddNewBatchModal(false);
      fetchBatches();
    });
  };

  return (
    <Fragment>
      <SmartModal
        open={showAddNewBatchModal}
        onClose={() =>
          setShowAddNewBatchModal(
            (showAddNewBatchModal) => (showAddNewBatchModal = false)
          )
        }
        header="New Batch"
        showHeader={true}
        size="md"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        <div className="w-full flex flex-col">
          <label
            htmlFor="last_name"
            className="font-medium text-sm text-gray-600"
          >
            <span>Batch Name</span> <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="last_name"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
            placeholder=""
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </div>

        <div className="w-full mt-4 flex flex-col">
          <label
            htmlFor="description"
            className="font-medium text-sm text-gray-600"
          >
            Batch Description
          </label>
          <input
            type="text"
            id="description"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
            value={batchDescription}
            onChange={(e) => setBatchDescription(e.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <div className="w-1/2 flex flex-col">
            <label
              htmlFor="batch_type"
              className="font-medium text-sm text-gray-600"
            >
              <span>School</span> <span className="text-red-500">*</span>
            </label>
            <select
              type="text"
              id="batch_type"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              value={schoolTypeId}
              onChange={(e) => handleSchoolTypeChange(e)}
            >
              <option value={""} disabled>
                Select
              </option>
              {schoolTypes.map((schoolType) => (
                <option key={schoolType.id} value={schoolType.id}>
                  {schoolType.display_flag}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2 flex flex-col">
            <label
              htmlFor="batch_type"
              className="font-medium text-sm text-gray-600"
            >
              <span>Type</span> <span className="text-red-500">*</span>
            </label>
            <select
              type="text"
              id="batch_type"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg"
              value={schoolLevelId}
              disabled={!schoolTypeId}
              onChange={(e) => handleSchoolLevelChange(e)}
            >
              <option value={""} disabled>
                Select
              </option>
              {schoolLevels.map((schoolLevel) => (
                <option key={schoolLevel.id} value={schoolLevel.id}>
                  {schoolLevel.display_flag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full mt-4 flex flex-col">
          <label
            htmlFor="subject"
            className="font-medium text-sm text-gray-600"
          >
            <span>Class</span> <span className="text-red-500">*</span>
          </label>
          <select
            type="text"
            id="subject"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg"
            value={schoolClassId}
            disabled={!schoolTypeId || !schoolLevelId}
            onChange={(e) => handleSchoolClassChange(e)}
          >
            <option value={""} disabled>
              Select
            </option>
            {schoolClasses.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.display_flag}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full mt-4 flex flex-col">
          <label
            htmlFor="subject"
            className="font-medium text-sm text-gray-600"
          >
            <span>Subject</span> <span className="text-red-500">*</span>
          </label>
          <select
            type="text"
            id="subject"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg"
            value={subjectId}
            disabled={!schoolTypeId || !schoolLevelId || !schoolClassId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value={""} disabled>
              Select
            </option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.display_flag}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button
            className="mt-6 px-4 pt-3.5 pb-4 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
            onClick={addNewBatch}
          >
            <i className="fa-solid fa-plus fa-fw"></i>{" "}
            <span>Add New Batch</span>
          </button>
        </div>
      </SmartModal>

      <div className="sticky top-0 flex flex-col">
        <MobileNavbar />
        <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight">
            Batches
          </h2>
          {batches.length > 0 && (
            <button
              className="px-4 py-1.5 font-semibold text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
              onClick={() => setShowAddNewBatchModal(true)}
            >
              <i className="fa-solid fa-plus fa-fw"></i>{" "}
              <span className="pr-1">New</span>
            </button>
          )}
        </div>
        <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
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
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      {batches.length === 0 && (
        <div className="w-full mt-6 p-10 bg-white border border-gray-200 text-center rounded-lg">
          <p className="text-gray-500">Start by creating your first batch</p>
          <button
            className="mt-4 mx-auto pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
            onClick={() => setShowAddNewBatchModal(true)}
          >
            <i className="fa-solid fa-plus fa-fw"></i> <span>Create Batch</span>
          </button>
        </div>
      )}

      {batches.length > 0 && (
        <div className="w-full">
          <div className="px-2 sm:px-4 lg:px-10 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {batches.map((batch, index) => (
              <NavLink
                key={index}
                to={`/batches/${batch.id}`}
                className="px-4 pt-3 pb-4 flex flex-col border border-gray-200 hover:border-gray-300 shadow-xs rounded-md group"
              >
                <h1 className="font-medium text-gray-600 group-hover:underline">
                  {batch.name}
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                  {batch.description}
                </p>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
}
