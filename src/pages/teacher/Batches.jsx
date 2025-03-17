import React, { Fragment, useEffect, useRef, useState } from "react";

import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

import Api from "@/api/Api.js";
import { NavLink } from "react-router-dom";

export default function Batches() {
  const [showAddNewBatchModal, setShowAddNewBatchModal] = useState(false);

  const [batches, setBatches] = useState([]);

  const [schools, setSchools] = useState([]);

  const [batchSchoolId, setBatchSchoolId] = useState('');
  const [batchName, setBatchName] = useState("");
  const [batchDescription, setBatchDescription] = useState("");

  useEffect(() => {
    fetchBatches();
    fetchSchools();
  }, []);

  useEffect(() => {
    if(showAddNewBatchModal) {
      setBatchSchoolId('');
      setBatchName('');
      setBatchDescription('');
    }
  }, [showAddNewBatchModal]);

  const addNewBatch = (e) => {
    e.preventDefault();

    const payload = {
      data: {
        name: batchName,
        type_of_school_id: batchSchoolId,
        description: batchDescription,
      },
    };

    console.log(payload);

    Api.post("/batches", payload).then(() => {
      setShowAddNewBatchModal(false);
      fetchBatches();
    });
  };

  const fetchBatches = () => {
    Api.get("/batches").then((response) => {
      setBatches(response.data.data);
    });
  };

  const fetchSchools = () => {
    Api.get("/type-of-schools").then((response) => {
      setSchools(response.data.data);
    });
  };

  return (
    <Fragment>
      <SmartModal
        open={showAddNewBatchModal}
        onClose={() =>
          setShowAddNewBatchModal(
            (showAddNewBatchModal) => (showAddNewBatchModal = false)
          )
        }
        header="New Batch"
        showHeader={true}
        size="md"
        centered={false}
        animationType="top"
        scrollable={true}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2/6 flex flex-col">
            <label htmlFor="batch_type" className="text-sm font-medium">
              <span>Type</span> <span className="text-red-500">*</span>
            </label>
            <select
              type="text"
              id="batch_type"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              value={batchSchoolId}
              onChange={(e) => setBatchSchoolId(e.target.value)}
            >
              <option value={''} disabled>
                Select
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.display_flag}
                </option>
              ))}
            </select>
          </div>
          <div className="w-4/6 flex flex-col">
            <label htmlFor="last_name" className="text-sm font-medium">
              <span>Name</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
              placeholder=""
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full mt-4 flex flex-col">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            type="text"
            id="email"
            className="w-full mt-2 py-2 px-2 text-sm border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:bg-gray-50 outline-none rounded-lg"
            rows="3"
            placeholder=""
            value={batchDescription}
            onChange={(e) => setBatchDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col justify-end">
          <button
            className="mt-6 px-4 pt-3.5 pb-4 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
            onClick={addNewBatch}
          >
            <i className="fa-solid fa-plus fa-fw"></i>{" "}
            <span>Add New Batch</span>
          </button>
        </div>
      </SmartModal>

      <MobileNavbar />
      <div className="mt-2 mb-20 px-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Batches</h2>
            {batches.length > 0 && (
              <button
                className="px-4 pt-2 pb-2.5 font-semibold text-sm text-white bg-gray-700 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setShowAddNewBatchModal(true)}
              >
                <i className="fa-solid fa-user-plus fa-fw"></i>{" "}
                <span>Create Batch</span>
              </button>
            )}
          </div>

          {batches.length === 0 && (
            <div className="w-full mt-6 p-10 bg-white border border-gray-200 text-center rounded-lg">
              <p className="text-gray-500">
                Start by creating your first batch
              </p>
              <button
                className="mt-4 mx-auto pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
                onClick={() => setShowAddNewBatchModal(true)}
              >
                <i className="fa-solid fa-plus fa-fw"></i>{" "}
                <span>Create Batch</span>
              </button>
            </div>
          )}

          {batches.length > 0 && (
            <div className="w-full mt-6 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                {batches.map((batch, index) => (
                  <NavLink
                    key={index}
                    to={`/batches/${batch.id}`}
                    className="px-4 pt-3 pb-4 flex flex-col border border-gray-200 shadow-xs hover:shadow-sm rounded-lg cursor-pointer"
                  >
                    <div className="flex items-start space-x-2">
                      <div>
                        <h6 className="font-medium text-gray-600">
                          {batch.name}
                        </h6>
                        <p className="text-sm text-gray-400">{batch.type_of_school.display_flag}</p>
                        <p className="mt-2 text-sm text-gray-400">
                          {batch.description}
                        </p>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
