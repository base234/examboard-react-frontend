import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import QuestionRenderer from "@/components/QuestionRenderer";
import { formatDisplayFromSeconds } from "@/general-helpers";

import Api from "@/api/Api.js";

export default function QuestionPaper() {
  const params = useParams();

  const questionPaperId = params.id;

  const [questionPaper, setQuestionPaper] = useState({});
  const [typeOfQuestions, setTypeOfQuestions] = useState([]);
  const [questionsInQuestionPaper, setQuestionsInQuestionPaper] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showAddQuestionsListModal, setShowAddQuestionsListModal] =
    useState(false);

  const [countQuestions, setCountQuestions] = useState(0);
  const [countMarks, setCountMarks] = useState(0);
  const [countDuration, setCountDuration] = useState(0);

  useEffect(() => {
    fetchQuestionPaper();
    fetchTypeOfQuestions();
    fetchQuestions();
    fetchQuestionsInQuestionPaper();
  }, []);

  useEffect(() => {
    handleQuestionPaperCounts();
  }, [questionPaper, questionsInQuestionPaper, questions]);

  const fetchQuestionPaper = () => {
    Api.get(`/question-papers/${questionPaperId}`).then((response) => {
      setQuestionPaper(response.data.data);
    });
  };

  const fetchTypeOfQuestions = () => {
    Api.get("/type-of-questions").then((response) => {
      setTypeOfQuestions(response.data.data);
    });
  };

  const fetchQuestionsInQuestionPaper = () => {
    Api.get(`/question-papers/${questionPaperId}?isShowQuestions=true`).then(
      (response) => {
        setQuestionsInQuestionPaper(response.data.data.questions);
        fetchQuestions();
      }
    );
  };

  const fetchQuestions = () => {
    Api.get(`/questions-bank?excludeQuestionPaper=${questionPaperId}`).then(
      (response) => {
        setQuestions(response.data.data);
      }
    );
  };

  const addToQuestionPaper = (questionPaperId, questionId) => {
    Api.get(`/question-papers/${questionPaperId}/questions/${questionId}`)
      .then(() => {
        fetchQuestionsInQuestionPaper();
        fetchQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeFromQuestionPaper = (questionPaperId, questionId) => {
    Api.delete(`/question-papers/${questionPaperId}/questions/${questionId}`)
      .then(() => {
        fetchQuestionsInQuestionPaper();
        fetchQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleQuestionPaperCounts = () => {
    setCountQuestions(questionsInQuestionPaper.length);
    setCountMarks(
      questionsInQuestionPaper.reduce((acc, question) => {
        return acc + question.marks;
      }, 0)
    );
    setCountDuration(
      questionsInQuestionPaper.reduce((acc, question) => {
        return acc + question.duration;
      }, 0)
    );
  };
  return (
    <Fragment>
      <SmartModal
        open={showAddQuestionsListModal}
        onClose={() =>
          setShowAddQuestionsListModal(
            (prevShowAddQuestionsListModal) =>
              (prevShowAddQuestionsListModal = false)
          )
        }
        header="Create New Test using AI"
        showHeader={false}
        size="4xl"
        centered={false}
        animationType="top"
        scrollable={false}
      >
        <div className="flex">
          <div className="w-3/12">
            <div className="sticky top-0 p-4 bg-blue-50 border border-gray-200 rounded-tl-lg rounded-bl-lg space-y-2">
              {typeOfQuestions.length > 0 && (
                <Fragment>
                  {typeOfQuestions.map((typeOfQuestion, index) => (
                    <div
                      key={index}
                      className="text-sm flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <p
                        title={typeOfQuestion.display_flag}
                        className="text-gray-600 uppercase"
                      >
                        {typeOfQuestion.flag}
                      </p>
                    </div>
                  ))}
                </Fragment>
              )}
            </div>
          </div>
          <div className="w-9/12 h-[calc(100%-55px)]">
            {questions.length === 0 && (
              <div className="px-6 pb-4 mt-4 bg-white text-center rounded-lg">
                <p className="py-4 text-sm text-gray-400 rounded-lg">
                  No questions available to add in this question paper
                </p>
              </div>
            )}

            {questions.length > 0 && (
              <Fragment>
                <div className="w-full py-2 px-5 sticky top-0 bg-white shadow-sm rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-full px-2 py-2 border border-gray-200 rounded-md inline-flex items-center space-x-2">
                      <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                      <input
                        type="text"
                        className="w-full text-sm text-gray-500 outline-none"
                        placeholder="Search questions..."
                      />
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 mt-4 flex flex-col space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className="p-2 w-full border border-gray-200 rounded-md"
                    >
                      <div className="font-medium text-gray-400 flex justify-between">
                        <h6 className="text-xs uppercase">
                          {question.type_of_question.flag}
                        </h6>
                        <h6 className="text-xs">
                          {question.marks} Mark{question.marks > 1 ? "s" : ""}
                        </h6>
                      </div>
                      <div className="my-4">
                        <QuestionRenderer
                          classes="text-sm"
                          htmlContent={question.question}
                        />
                      </div>
                      <div className="my-2 font-medium text-sm text-gray-400 flex flex-col space-y-2">
                        {question.options.map((option, index) => {
                          return (
                            <div
                              key={index}
                              className={`${
                                question.answer_options[0] === option
                                  ? "text-green-700"
                                  : ""
                              } flex items-start space-x-2`}
                            >
                              <p>{index + 1}.</p>
                              <p>{option}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() =>
                            addToQuestionPaper(questionPaperId, question.id)
                          }
                          className="py-1 px-1.5 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-dashed cursor-pointer"
                        >
                          <span>more details</span>
                        </button>
                        <button
                          onClick={() =>
                            addToQuestionPaper(questionPaperId, question.id)
                          }
                          className="py-1 px-1.5 font-semibold text-xs text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-md cursor-pointer"
                        >
                          <i className="fa-solid fa-plus fa-fw fa-xs mr-1"></i>
                          <span className="uppercase">Add Question</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </SmartModal>
      <MobileNavbar />
      <div className="sticky top-0 flex flex-col">
        <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg md:text-2xl font-bold tracking-tight">
              Question Papers
            </h2>
            <div>
              <i className="fa-solid fa-chevron-right fa-fw fa-sm"></i>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-gray-700">{questionPaper.name}</p>
              <span className="py-1 px-2 font-semibold text-sm text-gray-600 bg-gray-100 rounded">
                {questionPaper.code}
              </span>
            </div>
          </div>
        </div>
        <div className="py-1 px-10 bg-white border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm">Class V, Physics</p>
          <div className="flex items-center space-x-2">
            <p className="px-2 py-0.5 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-md">
              Q: {countQuestions}
            </p>
            <p className="px-2 py-0.5 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-md">
              FM: {countMarks} / {questionPaper.total_marks}
            </p>
            <p className="px-2 py-0.5 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-md">
              Duration: {formatDisplayFromSeconds(countDuration)} /{" "}
              {formatDisplayFromSeconds(questionPaper.duration)}
            </p>
            <button
              className="px-2 py-1 font-semibold text-sm text-white bg-green-700 hover:bg-green-500 rounded-md cursor-pointer"
              onClick={() => setShowAddQuestionsListModal(true)}
            >
              <i className="fa-solid fa-plus"></i> <span>Add Question</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-10 mt-10 flex space-x-4">
        <div className="w-1/6">
          <div className="sticky top-32 p-4 border border-gray-200 rounded-lg space-y-2">
            <h1 className="font-semibold text-lg">Filters</h1>
            {typeOfQuestions.length > 0 && (
              <div className="my-4 space-y-2">
                {typeOfQuestions.map((typeOfQuestion, index) => (
                  <div
                    key={index}
                    className="text-sm flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <p
                      title={typeOfQuestion.display_flag}
                      className="text-gray-600 uppercase"
                    >
                      {typeOfQuestion.flag}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-5/6 max-w-4xl">
          {questionsInQuestionPaper.length === 0 && (
            <div className="mt-10 text-center">
              <h1 className="text-gray-700">
                <i className="fa-regular fa-file fa-fw fa-2xl"></i>
              </h1>
              <p className="my-4 text-sm text-gray-400 rounded-lg">
                No questions available in this question paper
              </p>
              <button
                className="mt-4 px-4 py-2 font-semibold text-sm text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md cursor-pointer"
                onClick={() => setShowAddQuestionsListModal(true)}
              >
                <i className="fa-solid fa-plus fa-fw"></i>{" "}
                <span>Add Question</span>
              </button>
            </div>
          )}

          {questionsInQuestionPaper.length > 0 && (
            <Fragment>
              <div className="pb-6 flex flex-col space-y-2">
                {questionsInQuestionPaper.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 w-full border border-gray-200 rounded-md"
                  >
                    <div className="font-medium text-gray-400 flex justify-between">
                      <h6 className="text-xs uppercase">
                        {question.type_of_question.flag}
                      </h6>
                      <h6 className="text-xs">
                        {question.marks} Mark{question.marks > 1 ? "s" : ""}
                      </h6>
                    </div>
                    <div className="my-4">
                      <QuestionRenderer
                        classes="text-sm"
                        htmlContent={question.question}
                      />
                    </div>
                    <div className="my-2 font-medium text-sm text-gray-400 flex flex-col space-y-2">
                      {question.options.map((option, index) => {
                        return (
                          <div
                            key={index}
                            className={`${
                              question.answer_options[0] === option
                                ? "text-green-700"
                                : ""
                            } flex items-start space-x-2`}
                          >
                            <p>{index + 1}.</p>
                            <p>{option}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          addToQuestionPaper(questionPaperId, question.id)
                        }
                        className="py-1 px-1.5 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-dashed cursor-pointer"
                      >
                        <span>show details</span>
                      </button>
                      <button
                        onClick={() =>
                          removeFromQuestionPaper(questionPaperId, question.id)
                        }
                        className="py-1 px-1.5 font-semibold text-xs text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 rounded-md cursor-pointer"
                      >
                        <i className="fa-solid fa-xmark fa-fw fa-xs mr-1"></i>
                        <span className="uppercase">Remove Question</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="w-full mx-auto py-3 font-semibold text-sm text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md cursor-pointer"
                onClick={() => setShowAddQuestionsListModal(true)}
              >
                <i className="fa-solid fa-plus fa-fw"></i>
                <span>Add Question</span>
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}
