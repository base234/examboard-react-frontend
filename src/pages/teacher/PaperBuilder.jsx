import React, { Fragment, useEffect, useRef, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import axios from "axios";

export default function PaperBuilder() {
  const [showNewTestBuilderModal, setShowNewTestBuilderModal] = useState(false);
  const [
    showCreateQuestionPaperByUploadingPDF,
    setshowCreateQuestionPaperByUploadingPDF,
  ] = useState(false);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Reference to cancel token source for cancelling uploads
  const cancelTokenRef = useRef(null);
  const dropAreaRef = useRef(null);

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
        <div className="w-2/5 flex flex-col">
          <label htmlFor="serial_no" className="text-sm font-medium">
            Serial no.
          </label>
          <input
            type="text"
            id="serial_no"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
            placeholder=""
          />
          {/* {formik.touched.topic && (
                <p className="mt-2 text-sm text-red-500">
                  {formik.errors.topic}
                </p>
              )} */}
        </div>

        <div className="w-full mt-4 flex flex-col">
          <label htmlFor="paper_name" className="text-sm font-medium">
            Paper Name
          </label>
          <input
            type="text"
            id="paper_name"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
            placeholder=""
          />
          {/* {formik.touched.topic && (
                <p className="mt-2 text-sm text-red-500">
                  {formik.errors.topic}
                </p>
              )} */}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <div className="w-1/2 flex flex-col">
            <label htmlFor="serial_no" className="text-sm font-medium">
              <span>Paper Code</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="paper_code"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
            />
            {/* {formik.touched.topic && (
                <p className="mt-2 text-sm text-red-500">
                  {formik.errors.topic}
                </p>
              )} */}
          </div>
          <div className="w-1/2 flex flex-col">
            <label
              htmlFor="question-paper-name"
              className="text-sm font-medium"
            >
              <span>Full Marks</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="full_marks"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
            />
          </div>
        </div>

        <div className="w-full mt-6 flex flex-col">
          <label htmlFor="serial_no" className="text-sm font-medium">
            Duration
          </label>
          <div className="mt-4 ml-0.5 grid grid-cols-3 gap-4">
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="10minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="10minutes">
                10 minutes
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="15minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="15minutes">
                15 minutes
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="20minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="20minutes">
                20 minutes
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="30minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="30minutes">
                30 minutes
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="45minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="45minutes">
                45 minutes
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="50minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="50minutes">
                50 minutes
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="60minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="60minutes">
                1 hour
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="90minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="90minutes">
                1.5 hours
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="120minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="120minutes">
                2 hours
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="150minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="150minutes">
                2.5 hours
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="180minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="180minutes">
                3 hours
              </label>
            </div>
            <div className="w-full font-medium text-gray-400 hover:text-gray-500 flex items-center space-x-2">
              <input type="radio" id="240minutes" name="duration" />
              <label className="text-sm cursor-pointer" htmlFor="240minutes">
                4 hours
              </label>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col justify-end">
          <button
            className="mt-6 px-4 pt-3.5 pb-4 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
            onClick={() => setShowNewTestBuilderModal(false)}
          >
            Create Paper
          </button>
        </div>
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

      <MobileNavbar />
      <div className="mt-2 mb-20 px-2">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight">Paper Builder</h2>
          <div className="w-full mt-6 p-10 bg-white border border-gray-200 text-center rounded-lg">
            <p className="text-gray-500">Start by creating a new test</p>
            <button
              className="mt-4 mx-auto pl-3 pr-4 pt-2 pb-2.5 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
              onClick={() => setShowNewTestBuilderModal(true)}
            >
              <i className="fa-solid fa-plus fa-fw"></i>{" "}
              <span>Create New Test</span>
            </button>
            <p className="my-4 text-gray-500">OR</p>
            <button
              className="mx-auto px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => setshowCreateQuestionPaperByUploadingPDF(true)}
            >
              <i className="fa-solid fa-bolt fa-fw"></i>{" "}
              <span>Create using AI</span>
            </button>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-file-alt text-gray-400 text-xl"></i>
                <h6 className="font-semibold">Test Created</h6>
              </div>
              <button className="px-4 font-semibold text-sm text-gray-500 hover:text-gray-700 hover:underline underline-offset-4 decoration-dashed rounded-lg cursor-pointer">
                Show all <i className="fa-solid fa-arrow-right fa-fw"></i>
              </button>
            </div>
            <hr className="border-gray-200" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="my-4 px-4 text-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-file-alt text-gray-500"></i>
                    <h6>Class 6 - Physics Assessment</h6>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 font-semibold text-sm text-gray-500 border border-gray-200 hover:text-gray-600 hover:border-gray-300 rounded-lg cursor-pointer">
                    Go to assessment
                  </button>
                  <button className="px-4 py-2 font-semibold text-sm text-gray-500 border border-gray-200 hover:text-gray-600 hover:border-gray-300 rounded-lg cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
