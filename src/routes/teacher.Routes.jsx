// Customer Routes (Accessible only if role is "customer")

import TeacherLayout from "@/layouts/TeacherLayout";

import TeacherIndex from "@/pages/teacher/TeacherIndex.jsx";
import Dashboard from "@/pages/teacher/Dashboard.jsx";
import Students from "@/pages/teacher/Students.jsx";

import Batches from "@/pages/teacher/Batches.jsx";
import Batch from "@/pages/teacher/Batches/Batch.jsx";

import QuestionBank from "@/pages/teacher/QuestionBank.jsx";
import MultipleChoiceQuestion from "@/pages/teacher/QuestionBank/MultipleChoiceQuestion.jsx";
import PaperBuilder from "@/pages/teacher/PaperBuilder.jsx";

import ProtectedRoute from "@/ProtectedRoute";

const TeacherRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute role="teacher">
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <TeacherIndex />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/students",
            element: <Students />,
          },
          {
            path: "/batches",
            element: <Batches />,
          },
          {
            path: "/batches/:id",
            element: <Batch />,
          },
          {
            path: "/question-bank",
            children: [
              {
                path: "/question-bank",
                element: <QuestionBank />,
              },
              {
                path: "/question-bank/mcq/new",
                element: <MultipleChoiceQuestion />,
              },
              // {
              //   path: "/question-bank/mcq/:id",
              //   element: <MultipleChoiceQuestion />,
              // },
              // {
              //   path: "/question-bank/maq/new",
              //   element: <MultipleAnswerQuestion />
              // }
            ],
          },
          {
            path: "/paper-builder",
            element: <PaperBuilder />,
          },
        ],
      },
    ],
  },
];

export default TeacherRoutes;
