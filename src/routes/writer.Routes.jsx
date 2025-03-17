// Writer Routes (Accessible only if role is "writer")

import WriterLayout from "@/layouts/WriterLayout";

import Dashboard from "@/pages/writer/Dashboard";

import ProtectedRoute from "@/ProtectedRoute";

const WriterRoutes = [
  {
    path: "/writer",
    element: (
      <ProtectedRoute role="writer">
        <WriterLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ]
      },
    ],
  },
];

export default WriterRoutes;
