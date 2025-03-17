import React, { Fragment, useEffect, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import Api from "@/api/Api.js";
import { Link } from "react-router-dom";

export default function QuestionBank() {
  const [showTypeOfQuestionModal, setShowTypeOfQuestionModal] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const [typeOfQuestions, setTypeOfQuestions] = useState([]);
  const [isTypeOfQuestionLoading, setIsTypeOfQuestionLoading] = useState(false);

  const fetchTypeOfQuestions = () => {
    Api.get("/type-of-questions").then((response) => {
      setTypeOfQuestions(response.data.data);
      setIsTypeOfQuestionLoading(false);
    });
  };

  const handleNewQuestionTypeModal = () => {
    setShowTypeOfQuestionModal(true);
    setIsTypeOfQuestionLoading(true);
    fetchTypeOfQuestions();
  };

  return (
    <Fragment>
      <SmartModal
        open={showTypeOfQuestionModal}
        onClose={() =>
          setShowTypeOfQuestionModal(
            (showTypeOfQuestionModal) => (showTypeOfQuestionModal = false)
          )
        }
        header="New Question"
        showHeader={true}
        size="2xl"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        <div className="grid grid-cols-4 gap-4">
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/mcq/new"
          >
            <h6 className="font-semibold text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              Multiple Choice Question
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ MCQ ]</p>
          </Link>
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/maq/new"
          >
            <h6 className="font-medium text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              Multiple Answer Question
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ MAQ ]</p>
          </Link>
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/tf/new"
          >
            <h6 className="font-semibold text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              True or False
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ TF ]</p>
          </Link>
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/fib/new"
          >
            <h6 className="font-semibold text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              Fill in the Blanks
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ FIB ]</p>
          </Link>
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/mtf/new"
          >
            <h6 className="font-semibold text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              Match the Following
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ MTF ]</p>
          </Link>
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/ords/new"
          >
            <h6 className="font-semibold text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              Ordering in Sequence
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ ORDS ]</p>
          </Link>
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/ords/new"
          >
            <h6 className="font-semibold text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              Short Answer Type Question
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ SATQ ]</p>
          </Link>
          <Link
            className="p-4 grid grid-cols-1 content-between border-2 border-gray-200 hover:border-gray-400 hover:shadow-xs rounded-lg group"
            to="/question-bank/ords/new"
          >
            <h6 className="font-semibold text-sm text-gray-500 group-hover:text-gray-700 uppercase">
              Long Answer Type Question
            </h6>
            <p className="mt-4 text-sm text-gray-400">[ LATQ ]</p>
          </Link>
        </div>
      </SmartModal>

      <MobileNavbar />
      <div className="mt-2 mb-20 px-2">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight">Question Bank</h2>
          <div className="w-full mt-6 p-10 bg-white border border-gray-200 text-center rounded-lg">
            <p className="text-gray-500">No questions found</p>
            <button
              className="mt-4 mx-auto pl-3 pr-4 pt-2 pb-2.5 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
              onClick={handleNewQuestionTypeModal}
            >
              <i className="fa-solid fa-plus fa-fw"></i>{" "}
              <span>add new question</span>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
