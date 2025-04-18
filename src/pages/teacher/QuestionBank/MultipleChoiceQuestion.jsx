import React, { Fragment, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import RichTextEditor from "@/components/RichTextEditor";
import QuestionEditor from "@/components/QuestionEditor";

import MobileNavbar from "@/components/customer/MobileNavbar";

import QuestionRenderer from "@/components/QuestionRenderer";

import Api from "@/Api/Api";


export default function MultipleChoiceQuestion() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [showChoices, setShowChoices] = useState(true);

  const handleQuestionUpdate = (content) => {
    setQuestion(content);
  };

  const handleExplanationUpdate = (content) => {
    setExplanation(content);
  };

  const goToNextStep = () => {
    setStep((prevStep) => step + 1);
  };

  const goToPrevStep = () => {
    if (step === 1) return;
    setStep((prevStep) => step - 1);
  };

  const jumpToStep = (currentStep) => {
    setStep((prevStep) => currentStep);
  };

  // handle Options mechanism
  const addOption = () => {
    setOptions([...options, ""]);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (options[index] === correctAnswer) {
      setCorrectAnswer(null);
    }
  };
  // end handle options mechanism

  const saveQuestion = () => {
    const payload = {
      data: {
        question: question,
        options: options,
        explanation: explanation,
        correct_answer: correctAnswer,
      },
    };

    Api.post("/questions-bank?type_of_question=mcq", payload).then(() => {
      navigate("/question-bank");
    });
  };

  return (
    <Fragment>
      <div className="h-screen flex flex-col">
        <div className="sticky top-0 flex flex-col">
          <MobileNavbar />
          <div className="px-2 sm:px-4 lg:px-10 py-2 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between">
            <ul className="flex items-center space-x-2">
              <li>
                <h2 className="text-lg md:text-2xl font-bold tracking-tight">
                  Question Bank
                </h2>
              </li>
              <li>
                <i className="fa-solid fa-angle-right fa-fw"></i>
              </li>
              <li className="flex items-center space-x-2">
                <p className="hidden md:block">Multiple Choice Question</p>
                <p>[MCQ]</p>
              </li>
            </ul>
          </div>
          <div className="px-2 sm:px-4 lg:px-10 pt-2 pb-2.5 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex flex-col space-x-2">
              <div className="text-xs flex items-center space-x-2">
                <button
                  className={`${
                    step === 1
                      ? "font-semibold text-green-700"
                      : "text-gray-500 hover:underline decoration-dashed underline-offset-4 cursor-pointer"
                  } uppercase`}
                  onClick={() => jumpToStep(1)}
                >
                  Question
                </button>
                <i className="fa-solid fa-chevron-right fa-fw fa-2xs text-gray-400"></i>
                <button
                  className={`${
                    step === 2
                      ? "font-semibold text-green-700"
                      : "text-gray-500 hover:underline decoration-dashed underline-offset-4 cursor-pointer"
                  } uppercase`}
                  onClick={() => jumpToStep(2)}
                >
                  Options
                </button>
                <i className="fa-solid fa-chevron-right fa-fw fa-2xs text-gray-400"></i>
                <button
                  className={`${
                    step === 3
                      ? "font-semibold text-green-700"
                      : "text-gray-500 hover:underline decoration-dashed underline-offset-4 cursor-pointer"
                  } uppercase`}
                  onClick={() => jumpToStep(3)}
                >
                  Explanation
                </button>
                <i className="fa-solid fa-chevron-right fa-fw fa-2xs text-gray-400"></i>
                <button
                  className={`${
                    step === 4
                      ? "font-semibold text-green-700"
                      : "text-gray-500 hover:underline decoration-dashed underline-offset-4 cursor-pointer"
                  } uppercase`}
                  onClick={() => jumpToStep(4)}
                >
                  Final Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {step === 1 && (
            <div className="flex space-x-4 h-[calc(100vh-139px)]">
              <div className="w-1/2 mx-8 border-r border-gray-300 overflow-y-auto">
                <QuestionEditor
                  setPlaceholder="Type your question here..."
                  editorContent={question}
                  onUpdate={handleQuestionUpdate}
                />
              </div>
              <div className="w-1/2 overflow-y-auto">
                <div className="mt-2 px-12 py-4 rounded-lg">
                  <QuestionRenderer htmlContent={question} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              <div className="flex flex-col">
                <div className="mt-3 px-4 pt-2 pb-4 border border-gray-300 rounded-lg">
                  <label htmlFor="question" className="text-sm font-medium">
                    Question:
                  </label>

                  <hr className="my-2 border-gray-300 border-dashed" />

                  <div className="mt-3">
                    <QuestionRenderer htmlContent={question} />
                  </div>
                </div>

                <div className="my-4 flex flex-col space-y-2">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="p-4 grid grid-cols-2 space-x-2 bg-gray-50 rounded-lg gap-4"
                    >
                      <div className="flex flex-col">
                        <label
                          htmlFor={`option-${index}`}
                          className="text-sm font-medium"
                        >
                          Choice {index + 1}:
                        </label>
                        <textarea
                          name="choice"
                          id={`option-${index}`}
                          row="4"
                          className="w-full mt-2 py-2 px-3 text-sm bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-300  outline-none rounded-lg"
                          placeholder="Type choice here..."
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                        />
                        <div className="mt-4 mx-1 flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center space-x-2">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={correctAnswer === option}
                              onChange={() => setCorrectAnswer(option)}
                            />
                            <span>Correct Answer</span>
                          </label>
                          <button
                            className="py-1 pl-1 pr-2 font-semibold text-xs text-red-600 bg-red-50 border border-red-300 rounded-lg cursor-pointer"
                            onClick={() => removeOption(index)}
                          >
                            <i className="fa-solid fa-times fa-fw"></i> REMOVE
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor={`preview-${index}`}
                          className="text-sm font-medium"
                        >
                          Preview:
                        </label>
                        <div className="mt-3">{option}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addOption}
                  className="mt-4 mb-10 w-full py-2 font-semibold text-blue-800 border border-blue-400 border-dashed bg-blue-100 rounded"
                >
                  <i className="fa-solid fa-plus fa-fw"></i> ADD OPTION
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              <div className="flex flex-col">
                <div className="mt-3 px-4 pt-2 pb-4 border border-gray-300 rounded-lg">
                  <label htmlFor="question" className="text-sm font-medium">
                    Question:
                  </label>
                  <hr className="my-2 border-gray-300 border-dashed" />
                  <div className="mt-3 mb-4">
                    <QuestionRenderer htmlContent={question} />
                  </div>
                  <label
                    onClick={() =>
                      setShowChoices((prevShowChoices) => !prevShowChoices)
                    }
                    htmlFor="question"
                    className=" font-medium text-sm text-blue-600 cursor-pointer"
                  >
                    {showChoices ? (
                      <p className="flex items-center space-x-2">
                        <span>Hide choices</span>
                        <i className="fa-solid fa-chevron-up fa-fw fa-sm"></i>
                      </p>
                    ) : (
                      <p className="flex items-center space-x-2">
                        <span>Show choices</span>{" "}
                        <i className="fa-solid fa-chevron-down fa-fw fa-sm"></i>
                      </p>
                    )}
                  </label>
                  {showChoices && (
                    <div className="my-2 pt-2 pb-4 px-4 text-sm bg-gray-50 flex flex-col rounded-lg">
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className={`my-0.5 ${
                            option === correctAnswer
                              ? "font-semibold text-green-600"
                              : "text-gray-500"
                          } flex`}
                        >
                          <p className="w-6">{index + 1}.</p>
                          <p className="w-auto">{option}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <label htmlFor="question" className="mt-4 text-sm font-medium">
                  Explanation:
                </label>
                <div className="mt-2 mb-6">
                  <RichTextEditor
                    setPlaceholder="Type your explanation..."
                    editorContent={explanation}
                    onUpdate={handleExplanationUpdate}
                  />
                </div>
                <label htmlFor="question" className="text-sm font-medium">
                  Preview:
                </label>
                <div className="mt-3 mb-10">
                  <QuestionRenderer htmlContent={explanation} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              <div className="flex flex-col">
                <div className="mt-3 px-4 pt-2 pb-4 border border-gray-300 rounded-lg">
                  <label htmlFor="question" className="text-sm font-medium">
                    Question:
                  </label>
                  <hr className="my-2 border-gray-300 border-dashed" />
                  <div className="mt-3 mb-4">
                    <QuestionRenderer htmlContent={question} />
                  </div>
                  <label
                    onClick={() =>
                      setShowChoices((prevShowChoices) => !prevShowChoices)
                    }
                    htmlFor="question"
                    className=" font-medium text-sm text-blue-600 cursor-pointer"
                  >
                    {showChoices ? (
                      <p className="flex items-center space-x-2">
                        <span>Hide choices</span>
                        <i className="fa-solid fa-chevron-up fa-fw fa-sm"></i>
                      </p>
                    ) : (
                      <p className="flex items-center space-x-2">
                        <span>Show choices</span>{" "}
                        <i className="fa-solid fa-chevron-down fa-fw fa-sm"></i>
                      </p>
                    )}
                  </label>
                  {showChoices && (
                    <div className="my-2 pt-2 pb-4 px-4 text-sm bg-gray-50 flex flex-col rounded-lg">
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className={`my-0.5 ${
                            option === correctAnswer
                              ? "font-semibold text-green-600"
                              : "text-gray-500"
                          } flex`}
                        >
                          <p className="w-6">{index + 1}.</p>
                          <p className="w-auto">{option}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3 px-4 pt-2 pb-4 border border-gray-300 rounded-lg">
                  <label htmlFor="explanation" className="text-sm font-medium">
                    Explanation:
                  </label>
                  <hr className="my-2 border-gray-300 border-dashed" />
                  <div className="mt-3 mb-2">
                    {explanation === '<p style="text-align: left"></p>' ? (
                      <p className="text-sm text-gray-400">
                        No explanation provided
                      </p>
                    ) : (
                      <QuestionRenderer htmlContent={explanation} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 mt-auto px-2 sm:px-4 lg:px-10 py-2 bg-white border-t border-gray-300">
          <div
            className={`w-full flex items-center ${
              step > 1 ? "justify-between" : "justify-end"
            }`}
          >
            {step > 1 && (
              <button
                onClick={goToPrevStep}
                className="px-4 py-2 font-semibold text-sm border rounded-lg cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left fa-fw"></i> Prev
              </button>
            )}

            {step < 4 && (
              <button
                onClick={goToNextStep}
                className="px-4 py-2 font-semibold text-sm border rounded-lg cursor-pointer"
              >
                Next <i className="fa-solid fa-arrow-right fa-fw"></i>
              </button>
            )}

            {step === 4 && (
              <button
                onClick={saveQuestion}
                className="px-4 py-2 font-semibold text-sm border rounded-lg cursor-pointer"
              >
                <i className="fa-solid fa-flag-checkered fa-fw"></i> Finish &
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
