import React, { Fragment, useEffect, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import Api from "@/api/Api.js";
import { Link } from "react-router-dom";

import QuestionRenderer from "@/components/QuestionRenderer";
import { formatDisplayFromSeconds } from "@/general-helpers";

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [questionDetails, setQuestionDetails] = useState({});
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [showTypeOfQuestionModal, setShowTypeOfQuestionModal] = useState(false);

  const [typeOfQuestions, setTypeOfQuestions] = useState([]);
  const [isTypeOfQuestionLoading, setIsTypeOfQuestionLoading] = useState(false);

  const [showQuestionDetailsRightSidebar, setShowQuestionDetailsRightSidebar] =
    useState(false);
  const [isQuestionDetailsLoading, setIsQuestionDetailsLoading] =
    useState(true);

  const [showConfirmDeleteModalBox, setShowConfirmDeleteModalBox] =
    useState(false);
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    setIsQuestionsLoading((prevIsQuestionLoading) => true);

    Api.get("/questions-bank").then((response) => {
      setQuestions(response.data.data);
      setIsQuestionsLoading((prevIsQuestionLoading) => false);
    });
  };

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

  const showQuestionDetails = (questionId) => {
    setQuestionDetails({});
    setIsQuestionDetailsLoading((prevIsQuestionDetailsLoading) => true);
    setShowQuestionDetailsRightSidebar(true);

    Api.get(`/questions-bank/${questionId}`)
      .then((response) => {
        setQuestionDetails(response.data.data);
        setTimeout(() => {
          setIsQuestionDetailsLoading((prevIsQuestionDetailsLoading) => false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        setIsQuestionDetailsLoading((prevIsQuestionDetailsLoading) => false);
      });
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestionDetails({});
    setIsQuestionDetailsLoading((prevIsQuestionDetailsLoading) => true);
    setShowConfirmDeleteModalBox(true);

    Api.get(`/questions-bank/${questionId}`)
      .then((response) => {
        setQuestionDetails(response.data.data);
        setTimeout(() => {
          setIsQuestionDetailsLoading((prevIsQuestionDetailsLoading) => false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        setIsQuestionDetailsLoading((prevIsQuestionDetailsLoading) => false);
      });
  };

  const handleDeleteQuestionConfirm = (questionId) => {
    setShowConfirmDeleteModalBox(false);
    Api.delete(`/questions-bank/${questionId}`).then(() => {
      fetchQuestions();
    });
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

      <SmartModal
        open={showConfirmDeleteModalBox}
        onClose={() =>
          setShowConfirmDeleteModalBox(
            (showConfirmDeleteModalBox) => (showConfirmDeleteModalBox = false)
          )
        }
        showHeader={false}
        size="lg"
        centered={true}
        animationType="scale"
        scrollable={true}
      >
        <div className="p-4">
          <h4 className="font-semibold text-normal">
            Sure you want to delete this question?
          </h4>
          <p className="text-sm text-red-600">
            <strong>Note:</strong> This is permanent and cannot be undone.
          </p>

          {isQuestionDetailsLoading && (
            <div className="mt-6">
              <div className="w-1/3 h-4 shimmer rounded"></div>
              <div className="mt-3 flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <div className="w-3/5 h-4 shimmer rounded"></div>
                  <div className="w-2/5 h-4 shimmer rounded"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-1/5 h-4 shimmer rounded"></div>
                  <div className="w-2/5 h-4 shimmer rounded"></div>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <div className="w-1/2 h-8 shimmer rounded"></div>
                <div className="w-1/2 h-8 shimmer rounded"></div>
              </div>
            </div>
          )}

          {!isQuestionDetailsLoading && (
            <Fragment>
              <div className="pt-2 pb-3 px-3 my-4 bg-gray-50 border border-gray-200 rounded-md">
                <h1 className="font-semibold text-sm text-gray-700">
                  Question:
                  <span className="ml-2 px-2 py-0.5 text-gray-700 bg-gray-200 uppercase rounded">
                    {questionDetails.type_of_question.flag}
                  </span>
                </h1>
                <QuestionRenderer
                  classes="mt-2 text-sm text-gray-700"
                  htmlContent={questionDetails.question}
                />
              </div>
              <div className="mt-8 flex space-x-2">
                <button
                  className="w-full px-4 py-2 font-semibold text-sm text-red-600 bg-red-100 hover:bg-red-200 border border-red-200 rounded-md cursor-pointer"
                  onClick={() =>
                    handleDeleteQuestionConfirm(questionDetails.id)
                  }
                >
                  Delete Question
                </button>
                <button
                  className="w-full px-4 py-2 font-semibold text-sm text-gray-700 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-md cursor-pointer"
                  onClick={() => setShowConfirmDeleteModalBox(false)}
                >
                  <i className="fa-solid fa-times fa-fw"></i> Cancel
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </SmartModal>

      <div className="sticky top-0 flex flex-col">
        <MobileNavbar />
        <div
          onClick={() => setShowQuestionDetailsRightSidebar(false)}
          className={`fixed w-full h-full inset-0 z-40 bg-black/40 transition duration-500 ease-in-out ${
            showQuestionDetailsRightSidebar ? "" : "hidden"
          }`}
        />
        <div
          className={`z-50 fixed h-screen w-[600px] right-0 bg-white border-l border-gray-200 shadow transition-transform duration-150 ease-in-out transform ${
            showQuestionDetailsRightSidebar
              ? "translate-x-0"
              : "translate-x-full"
          } flex flex-col`}
        >
          <div className="sticky top-0 px-4 py-2 bg-gray-50 border-b border-gray-300 shadow-sm flex items-center justify-between">
            <h4 className="py-0.5 font-semibold text-lg text-gray-700">
              Question Details
            </h4>
            <div className="flex items-center space-x-1">
              <button className="py-0.5 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded cursor-pointer">
                <i className="fa-solid fa-pen fa-fw fa-sm"></i>
              </button>
              <button
                onClick={() => setShowQuestionDetailsRightSidebar(false)}
                className="py-0.5 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded cursor-pointer"
              >
                <i className="fa-solid fa-times fa-fw"></i>
              </button>
            </div>
          </div>
          <div className="px-4 pt-4 pb-10 overflow-y-auto">
            {isQuestionDetailsLoading && (
              <Fragment>
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
              </Fragment>
            )}
            {!isQuestionDetailsLoading && (
              <Fragment>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-sm text-gray-800">
                    Question:
                    <span className="ml-2 px-2 py-0.5 text-gray-700 bg-gray-100 uppercase rounded">
                      {questionDetails.type_of_question.flag}
                    </span>
                  </h1>
                  <span className="px-2 py-0.5 font-medium text-sm text-orange-600 bg-orange-100 rounded">
                    {questionDetails.marks}{" "}
                    {questionDetails.marks > 1 ? "marks" : "mark"}
                  </span>
                </div>
                <QuestionRenderer
                  classes="mt-4 text-sm"
                  htmlContent={questionDetails.question}
                />

                <hr className="mt-8 mb-6 border-gray-400 border-dashed" />

                <h4 className="mt-4 font-semibold text-sm text-gray-800">
                  Options:
                </h4>
                <div className="my-4 flex flex-col space-y-2">
                  {questionDetails.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 text-sm ${
                        questionDetails.answer_options[0] === option
                          ? "font-medium text-green-700 bg-green-100 border border-green-200"
                          : "text-gray-600 bg-gray-100"
                      } rounded-md`}
                    >
                      {option}
                    </div>
                  ))}
                </div>

                {questionDetails.explanation && (
                  <Fragment>
                    <h4 className="mt-8 pt-4 font-semibold text-sm text-gray-800 border-t border-gray-400 border-dashed">
                      Explanation:
                    </h4>
                    <QuestionRenderer
                      classes="mt-2 text-sm"
                      htmlContent={questionDetails.explanation}
                    />
                  </Fragment>
                )}

                <hr className="mt-8 mb-6 border-gray-400 border-dashed" />

                {questionDetails.difficulty && (
                  <div className="mt-8 text-sm text-gray-800 flex items-center space-x-2">
                    <span className="font-semibold">Difficulty:</span>
                    <span className="px-2 py-0.5 text-gray-700 bg-gray-100 rounded">
                      {questionDetails.difficulty}
                    </span>
                  </div>
                )}

                {questionDetails.duration && (
                  <div className="mt-4 text-sm text-gray-800 flex items-center space-x-2">
                    <span className="font-semibold">Duration:</span>
                    <span className="px-2 py-0.5 text-gray-700 bg-gray-100 rounded">
                      {formatDisplayFromSeconds(questionDetails.duration)}
                    </span>
                  </div>
                )}

                {questionDetails.note && (
                  <div className="mt-8 pt-4 text-sm text-gray-800 border-t border-dashed border-gray-400">
                    <p className="font-semibold">Note:</p>
                    <p className="mt-2 text-gray-500">{questionDetails.note}</p>
                  </div>
                )}
              </Fragment>
            )}
          </div>
        </div>

        <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight">
            Question Bank
          </h2>
          {questions.length > 0 && (
            <button
              className="px-4 py-1.5 font-semibold text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
              onClick={() => setShowTypeOfQuestionModal(true)}
            >
              <i className="fa-solid fa-plus fa-fw"></i>{" "}
              <span className="pr-1">New</span>
            </button>
          )}
        </div>
        {questions.length > 0 && (
          <Fragment>
            <div className="px-2 sm:px-4 lg:px-10 py-2 font-semibold text-xs md:text-sm text-left text-gray-500 bg-white border-y border-gray-200 grid grid-cols-12 gap-2">
              <div className="col-span-1">#</div>
              <div className="col-span-2">QUESTION</div>
              <div className="col-span-2">QUESTION TYPE</div>
              <div className="col-span-7 flex items-center justify-end space-x-2">
                ACTIONS
              </div>
            </div>
            <div className="px-2 sm:px-4 lg:px-10 py-1 text-xs md:text-sm text-left text-gray-600 bg-gray-50 border-y border-gray-200 grid grid-cols-12 gap-2">
              <div className="col-span-1"></div>
              <div className="col-span-2">
                <input
                  type="text"
                  className="py-1 px-2 text-sm bg-white border border-gray-300 rounded outline-0"
                />
              </div>
              <div className="col-span-2">
                <select
                  type="text"
                  className="py-1.5 px-2 font-medium text-sm bg-gray-100 rounded outline-0"
                >
                  <option value="mcq">Multiple Choice Question (MCQ)</option>
                  <option value="maq">Multiple Answer Question (MAQ)</option>
                  <option value="tf">True or False (TF)</option>
                  <option value="fib">Fill in the Blanks (FIB)</option>
                  <option value="mtf">Match the Following (MTF)</option>
                  <option value="ords">Ordering in Sequence (ORDS)</option>
                  <option value="saq">Short Answer Question (SAQ)</option>
                  <option value="latq">Long Answer Question (LATQ)</option>
                </select>
              </div>
              <div className="col-span-7"></div>
            </div>
          </Fragment>
        )}
      </div>

      {questions.length === 0 && (
        <div className="px-2 sm:px-4 lg:px-10 py-2 ">
          <div className="max-w-lg my-4">
            <p className="mt-4 text-sm text-gray-500">
              Question bank is a collection of questions that you can use to
              create assessments.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              There are different types of questions, choose the type that suits
              your needs.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Here are the types of questions that you can create:
            </p>
            <ul className="mt-4 text-sm text-gray-500 flex flex-col space-y-2">
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>MCQ - Multiple Choice Question</span>
              </li>
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>MAQ - Multiple Answer Question</span>
              </li>
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>TF - True or False</span>
              </li>
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>FIB - Fill in the Blanks</span>
              </li>
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>MTF - Match the Following</span>
              </li>
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>ORDS - Ordering in Sequence</span>
              </li>
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>SATQ - Short Answer Type Question</span>
              </li>
              <li className="inline-flex items-center space-x-2">
                <i className="fa-solid fa-check-circle fa-fw text-gray-400"></i>
                <span>LATQ - Long Answer Type Question</span>
              </li>
            </ul>
            <p className="my-10 text-sm text-gray-500">
              <button
                className="font-semibold text-gray-600 hover:text-gray-900 underline underline-offset-4 decoration-dashed cursor-pointer"
                onClick={handleNewQuestionTypeModal}
              >
                Click here
              </button>{" "}
              to create your first question and add it to your question bank.
            </p>
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <Fragment>
          {questions.map((question, index) => (
            <div
              key={index}
              className="px-2 sm:px-4 lg:px-10 py-2 text-xs md:text-sm text-left text-gray-500 border-y border-gray-200 grid grid-cols-12 gap-2"
            >
              <div className="col-span-1">{index + 1}</div>
              <div className="col-span-2">
                <QuestionRenderer
                  classes="text-sm text-gray-500"
                  htmlContent={question.question}
                />
              </div>
              <div className="col-span-2 uppercase">
                {question.type_of_question.flag}
              </div>
              <div className="col-span-7 flex items-center justify-end space-x-1.5">
                <button className="py-1 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded cursor-pointer">
                  <i className="fa-solid fa-pen fa-fw fa-sm"></i>
                </button>
                <button
                  onClick={() => showQuestionDetails(question.id)}
                  className="py-1 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded cursor-pointer"
                >
                  <i className="fa-solid fa-eye fa-fw"></i>
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="py-1 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded cursor-pointer"
                >
                  <i className="fa-solid fa-trash fa-fw"></i>
                </button>
              </div>
            </div>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
}
