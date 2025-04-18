import React, { Fragment, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import { useFormik } from "formik";

import Api from "@/api/Api";

import { formatDisplayFromSeconds } from "@/general-helpers";

export default function PaperBuilder() {
  const validate = (values) => {
    const errors = {};

    if (!values.paper_no) {
      errors.paper_no = "Required";
    }

    if (!values.paper_code) {
      errors.paper_code = "Required";
    }

    if (!values.paper_name) {
      errors.paper_name = "Required";
    }

    if (!values.paper_total_marks) {
      errors.paper_total_marks = "Required";
    } else if (values.paper_total_marks < 0) {
      errors.paper_total_marks = "Please enter a valid number";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      paper_no: "",
      paper_name: "",
      paper_code: "",
      paper_total_marks: "",
    },
    validate,
    onSubmit: (values) => {
      handleCreatePaper(values);
    },
  });

  const [showNewTestBuilderModal, setShowNewTestBuilderModal] = useState(false);
  const [
    showCreateQuestionPaperByUploadingPDF,
    setshowCreateQuestionPaperByUploadingPDF,
  ] = useState(false);
  const [showPaperDetailsRightSidebar, setShowPaperDetailsRightSidebar] =
    useState(false);

  const [questionPapers, setQuestionPapers] = useState([]);
  const [paperDuration, setPaperDuration] = useState(10);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Reference to cancel token source for cancelling uploads
  const cancelTokenRef = useRef(null);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

  const handleCreatePaper = async (e) => {

    const payload = {
      data: {
        ...formik.values,
        paper_duration: paperDuration,
      },
    };

    Api.post("/question-papers", payload).then((response) => {
      fetchQuestionPapers();
      setShowNewTestBuilderModal(false);
    });
  };

  const fetchQuestionPapers = async () => {
    Api.get("/question-papers").then((response) => {
      setQuestionPapers(response.data.data);
    });
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      // Check if it's a PDF
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setUploadStatus("idle");
        setErrorMessage("");
      } else {
        setErrorMessage("Please upload a PDF file");
        setUploadStatus("error");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file");
      setUploadStatus("error");
      return;
    }

    try {
      setResponse("");
      setProgress(0);
      setUploadStatus("uploading");
      setErrorMessage("");

      // Create a new cancel token source
      const CancelToken = axios.CancelToken;
      cancelTokenRef.current = CancelToken.source();

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:8000/pdf/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const progressValue = Math.round((e.loaded * 100) / e.total);
            setProgress(progressValue);
            if (progressValue === 100) {
              setUploadStatus("processing");
            }
          },
          responseType: "blob", // stream as binary blob
          cancelToken: cancelTokenRef.current.token,
        }
      );

      const reader = res.data.stream().getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || ""; // last incomplete event stays in buffer

        for (const event of events) {
          if (event.startsWith("event: message")) {
            const dataLine = event
              .split("\n")
              .find((line) => line.startsWith("data: "));
            if (dataLine) {
              const jsonData = dataLine.replace("data: ", "").trim();
              try {
                let parsed = JSON.parse(jsonData);
                if (parsed.content && parsed.content !== "[STOP_STREAMING]") {
                  setResponse((prevResponse) => prevResponse + parsed.content);
                }
              } catch (error) {
                console.warn("Failed to parse event data", jsonData, error);
              }
            }
          }
        }
      }

      setUploadStatus("success");
      // Clear the cancel token after successful completion
      cancelTokenRef.current = null;
    } catch (error) {
      if (axios.isCancel(error)) {
        setErrorMessage("Upload cancelled");
      } else {
        console.error("Upload failed:", error);
        setErrorMessage(error.message || "Upload failed. Please try again.");
      }
      setUploadStatus("error");
      cancelTokenRef.current = null;
    }
  };

  const cancelUpload = () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Upload cancelled by user");
      cancelTokenRef.current = null;
      setUploadStatus("error");
      setErrorMessage("Upload cancelled by user");
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Uploading file...";
      case "processing":
        return "Processing document...";
      case "success":
        return "Processing complete!";
      case "error":
        return "Error: " + errorMessage;
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case "uploading":
      case "processing":
        return "text-gray-400";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "";
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setResponse("");
    setUploadStatus("idle");
    setErrorMessage("");
  };

  return (
    <Fragment>
      <SmartModal
        open={showNewTestBuilderModal}
        onClose={() =>
          setShowNewTestBuilderModal(
            (showNewTestBuilderModal) => (showNewTestBuilderModal = false)
          )
        }
        header="Create New Test"
        showHeader={true}
        size="lg"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="w-2/5 flex flex-col">
            <label htmlFor="paper_no" className="text-sm font-medium">
              <span>Serial No.</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="paper_no"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.paper_no}
            />
            {formik.touched.paper_no && formik.errors.paper_no ? (
              <p className="mt-1 font-medium text-sm text-red-600">
                {formik.errors.paper_no}
              </p>
            ) : null}
          </div>

          <div className="w-full mt-4 flex flex-col">
            <label htmlFor="paper_name" className="text-sm font-medium">
              <span>Paper Name</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="paper_name"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.paper_name}
            />
            {formik.touched.paper_name && formik.errors.paper_name ? (
              <p className="mt-1 font-medium text-sm text-red-600">
                {formik.errors.paper_name}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex items-start space-x-2">
            <div className="w-1/2 flex flex-col">
              <label htmlFor="paper_code" className="text-sm font-medium">
                <span>Paper Code</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="paper_code"
                className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.paper_code}
              />
              {formik.touched.paper_code && formik.errors.paper_code ? (
                <p className="mt-1 font-medium text-sm text-red-600">
                  {formik.errors.paper_code}
                </p>
              ) : null}
            </div>
            <div className="w-1/2 flex flex-col">
              <label
                htmlFor="paper_total_marks"
                className="text-sm font-medium"
              >
                <span>Total Marks</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="paper_total_marks"
                className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.paper_total_marks}
              />
              {formik.touched.paper_total_marks &&
              formik.errors.paper_total_marks ? (
                <p className="mt-1 font-medium text-sm text-red-600">
                  {formik.errors.paper_total_marks}
                </p>
              ) : null}
            </div>
          </div>

          <div className="w-full mt-6 flex flex-col">
            <label htmlFor="paper_duration" className="text-sm font-medium">
              Duration
            </label>
            <div className="mt-4 ml-0.5 grid grid-cols-3 gap-4">
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input
                  type="radio"
                  id="10minutes"
                  name="paper_duration"
                  onClick={() => setPaperDuration(10)}
                />
                <label className="text-sm cursor-pointer" htmlFor="10minutes">
                  10 minutes
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input
                  type="radio"
                  id="15minutes"
                  name="paper_duration"
                  onClick={() => setPaperDuration(15)}
                />
                <label className="text-sm cursor-pointer" htmlFor="15minutes">
                  15 minutes
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input
                  type="radio"
                  id="20minutes"
                  name="paper_duration"
                  onClick={() => setPaperDuration(20)}
                />
                <label className="text-sm cursor-pointer" htmlFor="20minutes">
                  20 minutes
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="30minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="30minutes">
                  30 minutes
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="45minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="45minutes">
                  45 minutes
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="50minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="50minutes">
                  50 minutes
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="60minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="60minutes">
                  1 hour
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="90minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="90minutes">
                  1.5 hours
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="120minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="120minutes">
                  2 hours
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="150minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="150minutes">
                  2.5 hours
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="180minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="180minutes">
                  3 hours
                </label>
              </div>
              <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
                <input type="radio" id="240minutes" name="paper_duration" />
                <label className="text-sm cursor-pointer" htmlFor="240minutes">
                  4 hours
                </label>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col justify-end">
            <button
              type="submit"
              className="mt-6 px-4 pt-3.5 pb-4 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
            >
              Create Paper
            </button>
          </div>
        </form>
      </SmartModal>

      <SmartModal
        open={showCreateQuestionPaperByUploadingPDF}
        onClose={() => {
          setshowCreateQuestionPaperByUploadingPDF(false);
          resetUpload();
        }}
        header="Create New Test using AI"
        showHeader={false}
        size="xl"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        <div className="p-6 rounded-lg space-y-6">
          {/* File Selection Area with Drag & Drop */}
          <div>
            {!file ? (
              <div
                ref={dropAreaRef}
                className={`border-2 border-dashed ${
                  dragActive ? "border-blue-300 bg-blue-50" : "border-gray-200"
                } rounded-lg transition-colors`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <label className="w-full inline-block py-10 text-center text-white cursor-pointer transition-colors">
                  <i className="fa-solid fa-file-pdf text-gray-400 text-4xl"></i>
                  <p className="mt-8 text-sm text-gray-400">
                    <span className="underline">Click here</span> or drag n drop
                    your PDF file here
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf"
                  />
                  {dragActive && (
                    <div
                      className="absolute inset-0 z-50"
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    ></div>
                  )}
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full flex items-center justify-between">
                  <div className="w-full flex items-start space-x-2">
                    <div className="py-2 px-1 bg-gray-100 rounded-md">
                      <i className="fa-solid fa-file-pdf text-gray-500 fa-fw fa-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm">{file.name}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    {uploadStatus !== "uploading" &&
                    uploadStatus !== "processing" ? (
                      <Fragment>
                        <button
                          onClick={handleUpload}
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md cursor-pointer"
                        >
                          <i className="fa-solid fa-upload fa-fw fa-sm"></i>
                        </button>
                        <button
                          onClick={resetUpload}
                          className="px-2 py-1 text-red-500 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
                        >
                          <i className="fa-solid fa-times fa-fw fa-sm"></i>
                        </button>
                      </Fragment>
                    ) : (
                      <button
                        onClick={cancelUpload}
                        className="px-2 py-1 text-white bg-red-400 hover:bg-red-300 rounded-md cursor-pointer"
                      >
                        <i className="fa-solid fa-stop fa-fw fa-sm"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {(uploadStatus === "uploading" || uploadStatus === "processing") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className={`font-medium ${getStatusColor()}`}>
                  <i
                    className={`fa-solid ${
                      uploadStatus === "uploading"
                        ? "fa-cloud-upload-alt"
                        : "fa-cog fa-spin"
                    } mr-2`}
                  ></i>
                  {getStatusText()}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    uploadStatus === "processing"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {uploadStatus === "processing" && (
                <p className=" text-xs text-gray-400">
                  This may take a few moments as we analyze your document...
                </p>
              )}
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="py-4 text-center bg-red-50 rounded-lg flex flex-col">
              <i className="fa-solid fa-exclamation-circle text-red-400 fa-2x"></i>
              <p className="mt-4 font-medium text-red-600">Upload Failed</p>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Response Area */}
          {response && (
            <div className="space-y-2">
              <hr className="mt-2 mb-4 border-gray-300 border-dashed" />
              <h3 className="font-medium text-gray-700 flex items-center">
                <i className="fa-solid fa-robot text-blue-500 mr-2"></i>
                Here's the result
              </h3>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm overflow-y-auto max-h-80 whitespace-pre-wrap">
                {response}
              </div>
              <div className="flex justify-end space-x-3">
                <button className="px-3 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-md transition-colors">
                  <i className="fa-regular fa-copy mr-1"></i> Copy
                </button>
                <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
                  <i className="fa-solid fa-check mr-1"></i> Use This Result
                </button>
              </div>
            </div>
          )}
        </div>
      </SmartModal>

      <div className="sticky top-0 flex flex-col">
        <MobileNavbar />
        <div
          onClick={() => setShowPaperDetailsRightSidebar(false)}
          className={`fixed w-full h-full inset-0 z-40 bg-black/40 transition duration-500 ease-in-out ${
            showPaperDetailsRightSidebar ? "" : "hidden"
          }`}
        />
        <div
          className={`z-50 fixed h-screen w-[600px] right-0 bg-white border-l border-gray-200 shadow transition-transform duration-150 ease-in-out transform ${
            showPaperDetailsRightSidebar ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          <div className="sticky top-0 px-4 py-2 bg-gray-50 border-b border-gray-300 shadow-sm flex items-center justify-between">
            <h4 className="py-0.5 font-semibold text-lg text-gray-700">
              Paper Details
            </h4>
            <div className="flex items-center space-x-1">
              <button className="py-0.5 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded cursor-pointer">
                <i className="fa-solid fa-pen fa-fw fa-sm"></i>
              </button>
              <button
                onClick={() => setShowPaperDetailsRightSidebar(false)}
                className="py-0.5 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded cursor-pointer"
              >
                <i className="fa-solid fa-times fa-fw"></i>
              </button>
            </div>
          </div>
          <div className="px-4 pt-4 pb-10 overflow-y-auto">
            <div className="w-32 h-4 shimmer rounded"></div>
            <div className="mt-5 w-full flex flex-col space-y-3">
              <div className="flex space-x-2">
                <div className="w-3/5 h-4 shimmer rounded"></div>
                <div className="w-2/5 h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-2/9 h-4 shimmer rounded"></div>
                <div className="w-4/9 h-4 shimmer rounded"></div>
              </div>
            </div>

            <hr className="mt-8 mb-6 border-gray-400 border-dashed" />

            <div className="w-32 h-4 shimmer rounded"></div>
            <div className="mt-5 w-full flex flex-col space-y-3">
              <div className="flex space-x-2">
                <div className="w-2/6 h-5 shimmer rounded"></div>
                <div className="w-2/6 h-5 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-full h-5 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-2/9 h-5 shimmer rounded"></div>
                <div className="w-5/9 h-5 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-5/9 h-5 shimmer rounded"></div>
                <div className="w-3/9 h-5 shimmer rounded"></div>
              </div>
            </div>

            <hr className="mt-8 mb-6 border-gray-400 border-dashed" />

            <div className="w-32 h-4 shimmer rounded"></div>
            <div className="mt-5 w-full flex flex-col space-y-3">
              <div className="flex space-x-2">
                <div className="w-2/6 h-4 shimmer rounded"></div>
                <div className="w-2/6 h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-full h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-2/9 h-4 shimmer rounded"></div>
                <div className="w-5/9 h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-5/9 h-4 shimmer rounded"></div>
                <div className="w-3/9 h-4 shimmer rounded"></div>
              </div>
            </div>

            <hr className="mt-8 mb-6 border-gray-400 border-dashed" />

            <div className="mt-5 w-full flex flex-col space-y-3">
              <div className="flex space-x-2">
                <div className="w-3/10 h-4 shimmer rounded"></div>
                <div className="w-3/10 h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-3/10 h-4 shimmer rounded"></div>
                <div className="w-3/10 h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-3/10 h-4 shimmer rounded"></div>
                <div className="w-3/10 h-4 shimmer rounded"></div>
              </div>
            </div>

            <hr className="mt-8 mb-6 border-gray-400 border-dashed" />

            <div className="w-32 h-4 shimmer rounded"></div>
            <div className="mt-5 w-full flex flex-col space-y-3">
              <div className="flex space-x-2">
                <div className="w-2/6 h-4 shimmer rounded"></div>
                <div className="w-2/6 h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-full h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-2/9 h-4 shimmer rounded"></div>
                <div className="w-5/9 h-4 shimmer rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-5/9 h-4 shimmer rounded"></div>
                <div className="w-3/9 h-4 shimmer rounded"></div>
              </div>
            </div>

            <div>
              Ex laborum irure culpa adipisicing sunt id exercitation pariatur
              ut ut consequat tempor pariatur. Adipisicing laborum exercitation
              anim laborum duis deserunt aute elit. Officia Lorem mollit
              occaecat est commodo labore ex non adipisicing aute laborum quis.
              Aute pariatur fugiat ullamco voluptate sunt irure anim elit
              deserunt Lorem amet. Eu nisi et aute exercitation nulla commodo.
              In elit exercitation duis excepteur amet aliquip exercitation
              tempor in labore ex reprehenderit eu. Deserunt cupidatat consequat
              duis cillum non laborum enim anim labore elit. Pariatur incididunt
              Lorem eiusmod nostrud reprehenderit eu ipsum irure aute voluptate
              proident incididunt. Et esse aliqua elit nulla anim excepteur eu
              consequat. Exercitation ex ea pariatur voluptate in eu veniam
              aliquip proident cupidatat eiusmod. Duis commodo deserunt officia
              pariatur do proident in esse minim et nulla id. Adipisicing
              deserunt consequat et dolore id Lorem aliquip et nostrud id quis.
              Ea reprehenderit ipsum deserunt fugiat proident nisi ea velit ut
              tempor aliquip ad. Occaecat mollit ex quis nostrud sunt culpa non.
              Mollit sint tempor duis ipsum aute aute et do id commodo. Ea magna
              eu est consectetur ut. Aliquip pariatur excepteur mollit fugiat
              velit nisi cillum tempor cupidatat adipisicing incididunt minim
              dolore dolore. Non culpa commodo aliqua consequat nulla
              adipisicing. Sunt mollit fugiat cupidatat ipsum. Consequat sit ut
              incididunt sit cillum dolor tempor cillum dolore fugiat aute
              cupidatat veniam. Eiusmod ut ad amet tempor consectetur sit
              incididunt ut. Laborum dolore do cupidatat sit ipsum deserunt.
              Nostrud est ad Lorem nostrud aliqua velit. Ad cupidatat duis enim
              quis. Esse nulla irure laboris consectetur enim eu eu. Dolore sunt
              in voluptate esse eu sit. Occaecat ex id sit consequat cupidatat
              veniam aute. In enim veniam magna proident commodo anim nostrud eu
              mollit ea Lorem nisi id dolore. Tempor do quis quis proident
              occaecat nulla enim. Eu tempor nostrud anim amet enim aliqua aute
              labore deserunt eiusmod. Excepteur sunt quis voluptate cupidatat
              pariatur proident. Dolore qui laboris cillum ea. Et laborum dolor
              sit ad ad aliqua irure esse non sint voluptate et eiusmod. Laborum
              laboris officia dolore dolore incididunt voluptate sunt occaecat.
              Id ex in incididunt dolor commodo. Eiusmod laborum qui nulla
              dolor. Culpa exercitation laborum sunt nostrud elit excepteur
              Lorem tempor. Non magna adipisicing commodo amet laborum qui
              eiusmod aute ad proident dolore Lorem enim. Quis fugiat ex eu
              dolor proident magna magna Lorem culpa. Enim id laborum in culpa
              esse ipsum ea nulla ipsum ut nostrud irure amet do. Culpa
              voluptate nulla cupidatat labore elit ea laboris Lorem est.
            </div>
          </div>
        </div>

        <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight">
            Question Papers
          </h2>

          {questionPapers.length > 0 && (
            <div className="flex space-x-2">
              <button
                className="px-4 py-1.5 font-semibold text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setShowNewTestBuilderModal(true)}
              >
                <i className="fa-solid fa-plus fa-fw"></i>{" "}
                <span>New Question Paper</span>
              </button>
              <button
                className="px-4 py-1.5 font-semibold text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setshowCreateQuestionPaperByUploadingPDF(true)}
              >
                <i className="fa-solid fa-bolt fa-fw"></i>{" "}
                <span>Create using AI</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {questionPapers.length === 0 && (
        <div className="my-10 mx-10 p-10 bg-white border border-gray-200 text-center rounded-lg">
          <p className="text-gray-500">
            Start by creating your first Question Paper
          </p>
          <button
            className="mt-4 mx-auto pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
            onClick={() => setShowNewTestBuilderModal(true)}
          >
            <i className="fa-solid fa-plus fa-fw"></i>{" "}
            <span>Create Question Paper</span>
          </button>
        </div>
      )}

      {questionPapers.length > 0 && (
        <div className="w-full">
          <div className="px-2 sm:px-4 lg:px-10 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {questionPapers.map((questionPaper, index) => (
              <NavLink
                key={index}
                to={`/question-papers/${questionPaper.id}`}
                className="px-4 pt-3 pb-4 flex flex-col border border-gray-200 hover:border-gray-300 shadow-xs rounded-md group"
              >
                <h6 className="font-semibold text-xs text-gray-500">{questionPaper.code}</h6>
                <h1 className="font-semibold text-lg text-gray-700 group-hover:underline">
                  {questionPaper.name}
                </h1>
                <div className="w-full mt-4 flex space-x-2">
                  <div className="py-0.5 px-1 font-medium text-sm text-yellow-600 bg-yellow-50 border border-yellow-300 rounded flex items-center space-x-1">
                    <i className="fa-regular fa-clock text-yellow-500"></i>
                    <span>
                      {formatDisplayFromSeconds(questionPaper.duration)}
                    </span>
                  </div>
                  <div className="py-0.5 px-1 font-medium text-sm text-green-600 bg-green-50 border border-green-300/90 rounded flex items-center space-x-1">
                    <i className="fa-regular fa-flag text-green-500"></i>
                    <span>
                      {questionPaper.total_marks} Mark{questionPaper.total_marks > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
}
