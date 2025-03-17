import React, { Fragment, useEffect, useRef, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";

export default function Dashboard() {

  return (
    <Fragment>
      <MobileNavbar />
      <div className="mt-3 mb-20 px-2">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-medium">Hello Sayan 👋</h3>

          <p className="text-gray-500">Here's the current status for today</p>
          <div className="max-w-7xl mt-6 bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="uil uil-file-question-alt text-gray-400 text-2xl"></i>
                <h6 className="font-semibold">Upcoming assessments</h6>
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
                    <i className="uil uil-file-alt text-xl text-gray-500"></i>
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
