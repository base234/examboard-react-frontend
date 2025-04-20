import React, { Fragment, useEffect, useState } from "react";
import MobileNavbar from "@/components/customer/MobileNavbar";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SmartModal from "@/components/SmartModal";

import { useFormik } from "formik";

import Api from "@/api/Api";

import { formatDisplayFromSeconds, generateSerial } from "@/general-helpers";
import { NavLink } from "react-router-dom";

export default function Assessments() {
  const validate = (values) => {
    const errors = {};

    if (!values.serial_no) {
      errors.serial_no = "Required";
    }

    if (!values.exam_name) {
      errors.exam_name = "Required";
    }

    if (!values.exam_batch) {
      errors.exam_batch = "Required";
    }

    if (!values.exam_question_paper) {
      errors.exam_question_paper = "Required";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      serial_no: generateSerial("XM-"),
      exam_name: "",
      exam_batch: "",
      exam_question_paper: "",
    },
    validate,
    onSubmit: (values) => {
      handleCreateAssessment(values);
    },
  });

  const [showNewTestModal, setShowNewTestModel] = useState(false);
  const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("exam");

  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [examDetails, setExamDetails] = useState({});
  const [isExamDetailsLoading, setIsExamDetailsLoading] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState("");

  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  useEffect(() => {
    fetchExams();
    fetchBatches();
    fetchQuestionPapers();
  }, []);

  useEffect(() => {
    let serial = generateSerial("XM-");
    if (showNewTestModal) {
      formik.resetForm();
      formik.values.serial_no = generateSerial("XM-");
      formik.values.exam_batch = "";
      formik.values.exam_question_paper = "";
    }
  }, [showNewTestModal]);

  const handleCreateAssessment = (e) => {
    const payload = {
      data: {
        serial_no: formik.values.serial_no,
        name: formik.values.exam_name,
        batch_id: formik.values.exam_batch,
        question_paper_id: formik.values.exam_question_paper,
      },
    };

    Api.post("/exams", payload).then((response) => {
      fetchExams();
      setShowNewTestModel(false);
    });
  };

  const fetchExams = () => {
    Api.get("/exams").then((response) => {
      setExams(response.data.data);
    });
  };

  const fetchQuestionPapers = () => {
    Api.get("/question-papers").then((response) => {
      setQuestionPapers(response.data.data);
    });
  };

  const fetchBatches = () => {
    Api.get("/batches").then((response) => {
      setBatches(response.data.data);
    });
  };

  const showExamDetails = (examId) => {
    setShowExamDetailsModal(true);
    setIsExamDetailsLoading(true);
    setSelectedExamId(examId);
    setActiveTab("batch");

    Api.get(`/exams/${examId}`).then((response) => {
      setExamDetails(response.data.data);
      if (!response.data.data.start_time) {
        setStartDatetime(new Date());
        setEndDatetime(
          new Date(
            new Date().getTime() +
              response.data.data.question_paper.duration * 1000
          )
        );
      } else {
        setStartDatetime(new Date(response.data.data.start_time));
        setEndDatetime(new Date(response.data.data.end_time));
      }
      setIsExamDetailsLoading(false);
    });
  };

  const handleScheduleExam = () => {
    const payload = {
      data: {
        start_datetime: startDatetime,
        duration: examDetails.question_paper.duration,
      },
    };

    Api.patch(`/exams/${selectedExamId}`, payload)
      .then((response) => {
        setStartDatetime(new Date(startDatetime));
        setEndDatetime(
          new Date(startDatetime).getTime() +
            examDetails.question_paper.duration * 1000
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteExam = (selectedExamId) => {
    Api.delete(`/exams/${selectedExamId}`)
      .then((response) => {
        fetchExams();
        setShowExamDetailsModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const generateStudentsExamLoginCredentials = (examId) => {
    Api.get(`/exams/${examId}/exam-login-credentials`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Fragment>
      <SmartModal
        open={showExamDetailsModal}
        onClose={() =>
          setShowExamDetailsModal(
            (showExamDetailsModal) => (showExamDetailsModal = false)
          )
        }
        header="Exam Details"
        showHeader={true}
        size="lg"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        {isExamDetailsLoading && (
          <Fragment>
            <div className="w-full">
              <div className="w-2/5 h-4 shimmer rounded-md"></div>
              <div className="w-3/5 h-4 mt-2 shimmer rounded-md"></div>
            </div>
            <div className="mt-6 flex space-x-4">
              <div className="w-1/6 p-1.5 border border-gray-200 rounded-md">
                <div className="w-full h-4 shimmer rounded"></div>
              </div>
              <div className="w-1/6 p-1.5 border border-gray-200 rounded-md">
                <div className="w-full h-4 shimmer rounded"></div>
              </div>
              <div className="w-1/6 p-1.5 border border-gray-200 rounded-md">
                <div className="w-full h-4 shimmer rounded"></div>
              </div>
              <div className="w-1/6 p-1.5 border border-gray-200 rounded-md">
                <div className="w-full h-4 shimmer rounded"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="mx-2 flex space-x-2">
                <div className="w-1/12 h-4 shimmer rounded-md"></div>
                <div className="w-4/12 h-4 shimmer rounded-md"></div>
              </div>
              <div className="mx-2 flex space-x-2">
                <div className="w-1/12 h-4 shimmer rounded-md"></div>
                <div className="w-4/12 h-4 shimmer rounded-md"></div>
              </div>
              <div className="mx-2 flex space-x-2">
                <div className="w-1/12 h-4 shimmer rounded-md"></div>
                <div className="w-4/12 h-4 shimmer rounded-md"></div>
              </div>
              <div className="mx-2 flex space-x-2">
                <div className="w-1/12 h-4 shimmer rounded-md"></div>
                <div className="w-4/12 h-4 shimmer rounded-md"></div>
              </div>
            </div>
          </Fragment>
        )}

        {!isExamDetailsLoading && (
          <Fragment>
            <h1>{examDetails.name}</h1>
            <div className="mt-6 text-sm flex items-center space-x-2">
              <i className="uil uil-calendar-alt"></i>
              <span className="text-gray-600">
                {examDetails.is_scheduled ? (
                  <span className="text-gray-600">
                    {new Date(examDetails.start_time).toLocaleDateString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}{" "}
                    @{" "}
                    {new Date(examDetails.start_time).toLocaleTimeString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                ) : (
                  <span className="text-orange-600">Not scheduled</span>
                )}
              </span>
            </div>
            <div className="mt-1 text-sm flex items-center space-x-2">
              <i className="uil uil-clock"></i>
              <span className="text-gray-600">
                {formatDisplayFromSeconds(examDetails.question_paper?.duration)}
              </span>
            </div>
            <div className="mt-6 flex flex-col">
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("batch")}
                  className={`px-4 py-2 text-sm font-medium border border-transparent rounded-tl-md rounded-tr-md ${
                    activeTab === "batch"
                      ? "text-gray-700 border-x-gray-200 border-b-white border-t-gray-200"
                      : "text-blue-500 hover:text-blue-800 cursor-pointer"
                  }`}
                >
                  Batch
                </button>
                <button
                  onClick={() => setActiveTab("paper")}
                  className={`px-4 py-2 text-sm font-medium border border-transparent rounded-tl-md rounded-tr-md ${
                    activeTab === "paper"
                      ? "text-gray-700 border-x-gray-200 border-b-white border-t-gray-200"
                      : "text-blue-500 hover:text-blue-800 cursor-pointer"
                  }`}
                >
                  Paper
                </button>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`px-4 py-2 text-sm font-medium border border-transparent rounded-tl-md rounded-tr-md ${
                    activeTab === "schedule"
                      ? "text-gray-700 border-x-gray-200 border-b-white border-t-gray-200"
                      : "text-blue-500 hover:text-blue-800 cursor-pointer"
                  }`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab("delete")}
                  className={`px-4 py-2 text-sm font-medium border border-transparent rounded-tl-md rounded-tr-md ${
                    activeTab === "delete"
                      ? "text-gray-700 border-x-gray-200 border-b-white border-t-gray-200"
                      : "text-blue-500 hover:text-blue-800 cursor-pointer"
                  }`}
                >
                  Delete
                </button>
              </div>

              <div className="mt-3 text-sm">
                {activeTab === "batch" && (
                  <div className="p-4 bg-gray-100 rounded-md">
                    <h1 className="font-semibold">{examDetails.batch.name}</h1>
                    <div className="mt-2 text-sm flex items-center space-x-2">
                      <i className="uil uil-users-alt"></i>
                      <span className="text-gray-600">
                        {examDetails.batch.students.count} students
                      </span>
                    </div>

                    <div className="mt-4 p-2 border border-gray-300 rounded-md flex items-center justify-between space-x-2">
                      <p className="text-sm text-gray-600">
                        Generate students login credentials
                      </p>
                      <button
                      onClick={() => generateStudentsExamLoginCredentials(examDetails.id)}
                      className="px-4 py-2 font-semibold text-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 rounded-md cursor-pointer">
                        Generate
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === "paper" && (
                  <div className="p-4 bg-gray-100 rounded-md">
                    <h1 className="font-semibold">
                      {examDetails.question_paper.name} {"  "}
                      <span className="font-normal text-gray-500">
                        ({examDetails.question_paper.code})
                      </span>
                    </h1>
                    <div className="mt-2 text-sm flex items-center space-x-2">
                      <i className="uil uil-play"></i>
                      <span className="text-gray-500">
                        {examDetails.question_paper.total_marks} Full Marks,
                        {examDetails.question_paper.no_of_questions} Questions
                      </span>
                    </div>
                    <div className="mt-1 text-sm flex items-center space-x-2">
                      <i className="uil uil-clock"></i>
                      <span className="text-gray-500">
                        {formatDisplayFromSeconds(
                          examDetails.question_paper.duration
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {activeTab === "schedule" && (
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div>
                      <p className="text-sm text-gray-500">
                        Schedule exam time will have{" "}
                        <span className="font-semibold text-gray-500 bg-yellow-100 underline">
                          {formatDisplayFromSeconds(
                            examDetails.question_paper.duration
                          )}{" "}
                          duration
                        </span>{" "}
                        in end time.
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="w-full text-gray-500">Start Time:</p>
                        <DatePicker
                          className="w-44 py-1.5 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-md"
                          selected={startDatetime}
                          onChange={(date) => setStartDatetime(date)}
                          showTimeSelect
                          timeIntervals={1}
                          placeholderText="Start Datetime"
                          dateFormat="dd MMMM yyyy, h:mm aa"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="w-full text-gray-500">End Time:</p>
                        <p className="w-full px-2 text-right text-gray-500">
                          {new Date(endDatetime).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleScheduleExam}
                          className="px-4 py-2 font-semibold text-sm text-white bg-green-600 hover:bg-green-500 rounded-md cursor-pointer"
                        >
                          Schedule Exam
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "delete" && (
                  <div className="p-4 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-500">
                      Delete the scheduled exam with all its data.
                    </p>
                    <p className="mt-4 text-gray-500">Note:</p>
                    <p className=" text-gray-500">
                      This will delete directly without any confirmation and
                      cannot be undone.
                    </p>

                    <div className="mt-6 flex">
                      <button
                        className="px-4 py-2 font-semibold text-sm text-white bg-red-600 hover:bg-red-400 rounded-md cursor-pointer"
                        onClick={() => deleteExam(selectedExamId)}
                      >
                        Delete this exam
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Fragment>
        )}
      </SmartModal>
      <SmartModal
        open={showNewTestModal}
        onClose={() =>
          setShowNewTestModel((showNewTestModal) => (showNewTestModal = false))
        }
        header="New Test"
        showHeader={true}
        size="lg"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="w-2/5 flex flex-col">
            <label htmlFor="serial_no" className="text-sm font-medium">
              <span>Serial No.</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="serial_no"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.serial_no}
            />
            {formik.touched.serial_no && formik.errors.serial_no ? (
              <p className="mt-1 font-medium text-sm text-red-600">
                {formik.errors.serial_no}
              </p>
            ) : null}
          </div>

          <div className="w-full mt-4 flex flex-col">
            <label htmlFor="exam_name" className="text-sm font-medium">
              <span>Assessment Name</span>{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="exam_name"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder="E.g. Physics Semester 1 (2025 - 2026)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.exam_name}
            />
            {formik.touched.exam_name && formik.errors.exam_name ? (
              <p className="mt-1 font-medium text-sm text-red-600">
                {formik.errors.exam_name}
              </p>
            ) : null}
          </div>

          <div className="w-full mt-6 flex flex-col">
            <label htmlFor="exam_batch" className="text-sm font-medium">
              <span>Select Batch:</span> <span className="text-red-500">*</span>
            </label>
            <select
              id="exam_batch"
              className="w-full mt-2 py-2.5 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue=""
            >
              <option value="" disabled>
                Select Batch
              </option>
              {batches.map((batch, index) => (
                <option key={index} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            {formik.touched.exam_batch && formik.errors.exam_batch ? (
              <p className="mt-1 font-medium text-sm text-red-600">
                {formik.errors.exam_batch}
              </p>
            ) : null}
          </div>
          <div className="w-full mt-6 flex flex-col">
            <label
              htmlFor="exam_question_paper"
              className="text-sm font-medium"
            >
              <span>Select Question Paper:</span>{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="exam_question_paper"
              className="w-full mt-2 py-2.5 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue=""
            >
              <option value="" disabled>
                Select Question Paper
              </option>
              {questionPapers.map((questionPaper, index) => (
                <option key={index} value={questionPaper.id}>
                  {questionPaper.name} - {questionPaper.code}
                </option>
              ))}
            </select>
            {formik.touched.exam_question_paper &&
            formik.errors.exam_question_paper ? (
              <p className="mt-1 font-medium text-sm text-red-600">
                {formik.errors.exam_question_paper}
              </p>
            ) : null}
          </div>

          <div className="mt-2 flex flex-col justify-end">
            <button
              type="submit"
              className="mt-6 px-4 pt-3.5 pb-4 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
            >
              Create Assessment
            </button>
          </div>
        </form>
      </SmartModal>

      <div className="sticky top-0 flex flex-col">
        <MobileNavbar />

        <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight">
            Tests
          </h2>

          {exams.length > 0 && (
            <div className="flex space-x-2">
              <button
                className="pl-2 pr-3 py-1.5 font-semibold text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setShowNewTestModel(true)}
              >
                <i className="fa-solid fa-plus fa-fw"></i> <span>New Test</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {exams.length === 0 && (
        <div className="my-10 mx-10 p-10 bg-white border border-gray-200 text-center rounded-lg">
          <p className="text-gray-500">
            Start by creating your first Assessment
          </p>
          <button
            className="mt-4 mx-auto pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
            onClick={() => setShowNewTestModel(true)}
          >
            <i className="fa-solid fa-plus fa-fw"></i>{" "}
            <span>Create New Exam</span>
          </button>
        </div>
      )}

      {exams.length > 0 && (
        <div className="w-full">
          <div className="px-2 sm:px-4 lg:px-10 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {exams.map((exam, index) => (
              <div
                key={index}
                className="px-4 pt-3 pb-4 flex flex-col border border-gray-200 hover:border-gray-300 shadow-xs rounded-md"
              >
                <h1
                  className="font-semibold text-lg text-gray-700 hover:underline cursor-pointer"
                  onClick={() => showExamDetails(exam.id)}
                >
                  {exam.name}
                </h1>
                <h6 className="font- text-xs text-gray-500">
                  {exam.serial_no}
                </h6>

                <div className="mt-4 text-sm text-gray-400 flex flex-col">
                  <div className="flex items-center space-x-1">
                    <i className="uil uil-users-alt"></i>
                    <span>{exam.batch.students.count} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
}
