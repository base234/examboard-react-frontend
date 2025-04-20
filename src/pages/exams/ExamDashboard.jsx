import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const ExamDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add exam-related content here */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Your Exams</h2>
          <p className="text-gray-600">View and take your scheduled exams</p>
        </div>
      </div>
    </div>
  );
};

export default ExamDashboard;
