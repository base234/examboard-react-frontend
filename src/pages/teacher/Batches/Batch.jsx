import { Fragment, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import Api from "@/api/Api.js";
import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

export default function Batch() {
  const params = useParams();

  const batchId = params.id;

  const [currentMasterView, setCurrentMasterView] = useState("students");

  const [batch, setBatch] = useState({});
  const [students, setStudents] = useState([]);
  const [batchStudents, setBatchStudents] = useState([]);
  const [showAddStudentsListModal, setShowAddStudentsListModal] =
    useState(false);

  const [isLoadingBatchDetails, setIsLoadingBatchDetails] = useState(false);

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
    fetchBatchDetails();
    fetchBatchStudents();
    fetchSchoolTypes();
    fetchSubjects();
  }, []);

  useEffect(() => {
    setBatchName(batch.name);
    setBatchDescription(batch.description);
    setSchoolTypeId(batch.school_type?.id);
  }, [batch]);

  useEffect(() => {
    fetchSchoolLevels(schoolTypeId);
    setSchoolLevelId(batch.school_level?.id);
  }, [schoolTypeId]);

  useEffect(() => {
    fetchSchoolClasses(schoolLevelId);
    setSchoolClassId(batch.school_class?.id);
  }, [schoolLevelId]);

  useEffect(() => {
    setSubjectId(batch.subject?.id);
  }, [schoolClassId]);

  const fetchBatchDetails = () => {
    setIsLoadingBatchDetails(true);

    Api.get(`/batches/${batchId}`).then((response) => {
      setBatch((prevBatch) => response.data.data);
      setIsLoadingBatchDetails(false);
    });
  };

  const fetchBatchStudents = () => {
    Api.get(`/batches/${batchId}?isShowStudents=true`).then((response) => {
      setBatchStudents(response.data.data.students);
    });
  };

  const fetchStudents = () => {
    Api.get(`/students?excludeBatch=${batchId}`).then((response) => {
      setStudents((prevStudents) => response.data.data);
    });
  };

  const openAddStudentsListModal = () => {
    setStudents((prevStudents) => []);

    setShowAddStudentsListModal(true);

    fetchStudents();
  };

  const addStudentToBatch = (batchId, studentId) => {
    const payload = {
      data: {
        student_id: studentId,
        batch_id: batchId,
      },
    };

    Api.post(`/batches/${batchId}/students/${studentId}`, payload)
      .then(() => {
        fetchStudents();
        fetchBatchStudents();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeStudentFromBatch = (batchId, studentId) => {
    Api.delete(`/batches/${batchId}/students/${studentId}`).then(() => {
      fetchStudents();
      fetchBatchStudents();
    });
  };

  const fetchSchoolTypes = () => {
    Api.get("/schools").then((response) => {
      setSchoolTypes(response.data.data);
    });
  };

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

  const updateBatch = () => {

    const payload = {
      data: {
        school_type_id: schoolTypeId,
        school_level_id: schoolLevelId,
        school_class_id: schoolClassId,
        subject_id: subjectId,
        // name: batchName,
        // description: batchDescription,
      },
    };

    Api.post(`/batches/${batchId}`, payload).then(() => {
    });
  };
  return (
    <Fragment>
      <SmartModal
        open={showAddStudentsListModal}
        onClose={() =>
          setShowAddStudentsListModal(
            (showAddStudentsListModal) => (showAddStudentsListModal = false)
          )
        }
        header="Create New Test using AI"
        showHeader={false}
        size="md"
        centered={false}
        animationType="top"
        scrollable={false}
      >
        {students.length === 0 && (
          <div className="px-6 pb-4 mt-4 bg-white text-center rounded-lg">
            <p className="py-4 text-sm text-gray-400 rounded-lg">
              No students available to add in this batch
            </p>
          </div>
        )}

        {students.length > 0 && (
          <Fragment>
            <div className="w-full py-2 px-6 sticky top-0 bg-white flex items-center justify-between rounded-t-lg">
              <h2 className="w-3/5 font-semibold text-xl">Students List</h2>
              <input
                type="text"
                className="w-2/5 py-1 px-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div className="px-6 pb-6 mt-4 flex flex-col space-y-2">
              {students.map((student, index) => (
                <Fragment key={index}>
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-start space-x-2">
                      <div>
                        <i className="fa-solid fa-user-circle fa-fw fa-lg text-gray-500"></i>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addStudentToBatch(batchId, student.id)}
                      className="py-0.5 px-1.5 font-semibold text-gray-500 border border-gray-200 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <i className="fa-solid fa-plus fa-fw fa-xs"></i>
                    </button>
                  </div>

                  {index !== students.length - 1 && (
                    <hr className="border-gray-100" />
                  )}
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
      </SmartModal>

      <div className="sticky top-0 flex flex-col">
        <MobileNavbar />
        <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight">
            Batches
          </h2>
        </div>
        <div className="py-1 px-2 sm:px-4 lg:px-10 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setCurrentMasterView("students")}
              className={`pl-1 pr-1.5 text-sm text-gray-500 ${
                currentMasterView === "students"
                  ? "text-gray-800 bg-gray-200"
                  : "hover:text-gray-800 hover:bg-gray-100"
              } cursor-pointer rounded`}
            >
              <i className="fa-solid fa-users fa-fw text-gray-500 mr-1"></i>
              <span>Students</span>
            </button>
            <button
              onClick={() => setCurrentMasterView("analytics")}
              className={`pl-1 pr-1.5 text-sm text-gray-500 ${
                currentMasterView === "analytics"
                  ? "text-gray-800 bg-gray-200"
                  : "hover:text-gray-800 hover:bg-gray-100"
              } cursor-pointer rounded`}
            >
              <i className="fa-solid fa-chart-line fa-fw text-gray-500 mr-1"></i>
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setCurrentMasterView("details")}
              className={`pl-1 pr-1.5 text-sm text-gray-500 ${
                currentMasterView === "details"
                  ? "text-gray-800 bg-gray-200"
                  : "hover:text-gray-800 hover:bg-gray-100"
              } cursor-pointer rounded`}
            >
              <i className="fa-solid fa-info-circle fa-fw text-gray-500 mr-1"></i>
              <span>Details</span>
            </button>
            <button
              onClick={() => setCurrentMasterView("settings")}
              className={`pl-1 pr-1.5 py-1 text-sm text-gray-500 ${
                currentMasterView === "settings"
                  ? "text-gray-800 bg-gray-200"
                  : "hover:text-gray-800 hover:bg-gray-100"
              } cursor-pointer rounded`}
            >
              <i className="fa-solid fa-cog fa-fw text-gray-500 mr-1"></i>
              <span>Settings</span>
            </button>
          </div>
          <ul className="flex items-center space-x-2">
            <li>
              <NavLink to="/batches">
                <i className="uil uil-object-group text-gray-600"></i>
              </NavLink>
            </li>
            <li>
              <i className="fa-solid fa-chevron-right fa-fw fa-xs text-gray-400"></i>
            </li>
            <li>
              <p className="text-sm text-gray-600">{batch.name}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-2 sm:px-4 lg:px-10 flex space-x-10">
        <div className="w-4/6">
          {currentMasterView === "students" && (
            <Fragment>
              <div className="sticky top-[82px] bg-white">
                <div className="flex items-center justify-between">
                  <h1 className="py-4 font-semibold text-lg">Students</h1>
                  {batchStudents.length > 0 && (
                    <button
                      className="pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
                      onClick={openAddStudentsListModal}
                    >
                      <i className="fa-solid fa-plus fa-fw"></i>{" "}
                      <span>Students</span>
                    </button>
                  )}
                </div>
                <div className="px-2 sm:px-4 lg:px-10 py-2 font-semibold text-xs md:text-sm text-left text-gray-400 bg-gray-50 border-y border-gray-200 grid grid-cols-12 gap-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-2">NAME</div>
                  <div className="col-span-2">EMAIL</div>
                  <div className="col-span-7"></div>
                </div>
              </div>
              {batchStudents.length > 0 && (
                <Fragment>
                  {batchStudents.map((student, index) => (
                    <div
                      key={index}
                      className="px-2 sm:px-4 lg:px-10 text-xs md:text-sm text-left text-gray-600 border-b border-gray-200 hover:bg-yellow-50 grid grid-cols-12 gap-2"
                    >
                      <div className="col-span-1 py-2 font-semibold">
                        {index + 1}
                      </div>
                      <NavLink
                        to={`/students/id`}
                        className="col-span-2 py-2 hover:underline decoration-gray-400/60 underline-offset-4"
                      >
                        {student.full_name}
                      </NavLink>
                      <div className="col-span-2 py-2">{student.email}</div>
                      <div className="col-span-7 py-2 flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            removeStudentFromBatch(batchId, student.id)
                          }
                          title="Remove"
                          className="px-1 text-gray-300 hover:text-red-500 border border-gray-200 hover:border-red-300 rounded cursor-pointer"
                        >
                          <i className="fa-solid fa-times fa-fw fa-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </Fragment>
              )}

              {batchStudents.length === 0 && (
                <div className="py-10 w-full flex items-center justify-center">
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-gray-400">
                      Start adding students to this batch
                    </p>
                    <button
                      className="mt-4 mx-auto pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
                      onClick={openAddStudentsListModal}
                    >
                      <i className="fa-solid fa-plus fa-fw"></i>{" "}
                      <span>Add Students</span>
                    </button>
                  </div>
                </div>
              )}
            </Fragment>
          )}

          {currentMasterView === "analytics" && (
            <Fragment>
              <div className="sticky top-[82px] bg-white">
                <h1 className="py-4 font-semibold text-lg">Analytics</h1>
              </div>
              <div className="text-center">
                <p className="my-10 text-sm text-gray-400">
                  The magic is in progress
                </p>
              </div>
            </Fragment>
          )}

          {currentMasterView === "details" && (
            <Fragment>
              <div className="sticky top-[82px] bg-white">
                <h1 className="py-4 font-semibold text-lg">Details</h1>
              </div>
              <div className="text-center">
                <p className="my-10 text-sm text-gray-400">
                  Details are on the way
                </p>
              </div>
            </Fragment>
          )}

          {currentMasterView === "settings" && (
            <Fragment>
              <div className="sticky top-[82px] bg-white">
                <h1 className="py-4 font-semibold text-lg">Settings</h1>
              </div>

              <div className="max-w-lg mt-4 flex flex-col">
                <div className="flex flex-col">
                  <label
                    htmlFor="last_name"
                    className="font-medium text-sm text-gray-600"
                  >
                    <span>Batch Name</span>{" "}
                    <span className="text-red-500">*</span>
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
                      <span>School</span>{" "}
                      <span className="text-red-500">*</span>
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
                    onClick={updateBatch}
                  >
                    <i className="fa-solid fa-plus fa-fw"></i>{" "}
                    <span>Update</span>
                  </button>
                </div>
              </div>
            </Fragment>
          )}
        </div>
        <div className="w-2/6">
          <div className="fixed max-w-full pt-14 pb-6">
            <p className="font-semibold text-sm text-gray-500">Type:</p>
            {batch.type_of_school ? (
              <p className="mt-1 text-sm text-gray-500">
                {batch.type_of_school.display_flag}
              </p>
            ) : (
              <div className="w-12 h-2 shimmer"></div>
            )}

            <p className="mt-4 font-semibold text-sm text-gray-500">About:</p>
            {batch.description ? (
              <p className="mt-1 text-sm text-gray-500">{batch.description}</p>
            ) : (
              <p className="mt-1 italic text-sm text-gray-400">Not provided</p>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
