import React, { Fragment, useEffect, useState } from "react";
import MobileNavbar from "@/components/customer/MobileNavbar";

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
      console.log("Hello World!");
      handleCreateAssessment(values);
    },
  });

  const [showNewAssessmentModal, setShowNewAssessmentModel] = useState(false);

  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);

  useEffect(() => {
    fetchExams();
    fetchBatches();
    fetchQuestionPapers();
  }, []);

  useEffect(() => {
    let serial = generateSerial("XM-");
    if (showNewAssessmentModal) {
      formik.resetForm();
      formik.values.serial_no = generateSerial("XM-");
      formik.values.exam_batch = "";
      formik.values.exam_question_paper = "";
    }
  }, [showNewAssessmentModal]);

  const handleCreateAssessment = async (e) => {
    const payload = {
      data: {
        serial_no: formik.values.serial_no,
        name: formik.values.exam_name,
        batch_id: formik.values.exam_batch,
        question_paper_id: formik.values.exam_question_paper,
      },
    };

    console.log(payload);

    Api.post("/exams", payload).then((response) => {
      fetchExams();
      setShowNewAssessmentModel(false);
    });
  };

  const fetchExams = async () => {
    Api.get("/exams").then((response) => {
      setExams(response.data.data);
    });
  };

  const fetchQuestionPapers = async () => {
    Api.get("/question-papers").then((response) => {
      setQuestionPapers(response.data.data);
    });
  };

  const fetchBatches = async () => {
    Api.get("/batches").then((response) => {
      setBatches(response.data.data);
    });
  };

  return (
    <Fragment>
      <SmartModal
        open={showNewAssessmentModal}
        onClose={() =>
          setShowNewAssessmentModel(
            (showNewAssessmentModal) => (showNewAssessmentModal = false)
          )
        }
        header="Create New Assessment"
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
            Assessments
          </h2>

          {exams.length > 0 && (
            <div className="flex space-x-2">
              <button
                className="pl-2 pr-3 py-1.5 font-semibold text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setShowNewAssessmentModel(true)}
              >
                <i className="fa-solid fa-plus fa-fw"></i>{" "}
                <span>New Assessment</span>
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
            onClick={() => setShowNewAssessmentModel(true)}
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
              <NavLink
                key={index}
                to={`/question-papers/${exam.id}`}
                className="px-4 pt-3 pb-4 flex flex-col border border-gray-200 hover:border-gray-300 shadow-xs rounded-md group"
              >
                <h6 className="font-semibold text-xs text-gray-500">
                  {exam.code}
                </h6>
                <h1 className="font-semibold text-lg text-gray-700 group-hover:underline">
                  {exam.name}
                </h1>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
}
