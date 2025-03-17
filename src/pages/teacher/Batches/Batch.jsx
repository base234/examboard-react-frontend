import { Fragment, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import Api from "@/api/Api.js";
import MobileNavbar from "@/components/customer/MobileNavbar";
import SmartModal from "@/components/SmartModal";

export default function Batch() {
  const params = useParams();

  const batchId = params.id;

  const [batch, setBatch] = useState({});
  const [students, setStudents] = useState([]);
  const [batchStudents, setBatchStudents] = useState([]);
  const [showAddStudentsListModal, setShowAddStudentsListModal] =
    useState(false);

  useEffect(() => {
    fetchBatchDetails();
    fetchBatchStudents();
  }, []);

  const fetchBatchDetails = () => {
    Api.get(`/batches/${params.id}`).then((response) => {
      setBatch(response.data.data);
    });
  };

  const fetchBatchStudents = () => {
    Api.get(`/batches/${params.id}?isShowStudents=true`).then((response) => {
      setBatchStudents(response.data.data.students);
    });
  };

  const fetchStudents = () => {
    Api.get(`/students?excludeBatch=${params.id}`).then((response) => {
      setStudents((prevStudents) => response.data.data);
    });
  };

  const openAddStudentsListModal = () => {
    setStudents((prevStudents) => []);

    setShowAddStudentsListModal(true);

    fetchStudents();
  };

  const addStudentToBatch = (batchId, studentId) => {
    const payload = {
      data: {
        student_id: studentId,
        batch_id: batchId,
      },
    };

    Api.post(`/batches/${batchId}/students/${studentId}`, payload)
      .then(() => {
        fetchStudents();
        fetchBatchStudents();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeStudentFromBatch = (batchId, studentId) => {
    Api.delete(`/batches/${batchId}/students/${studentId}`).then(() => {
      fetchStudents();
      fetchBatchStudents();
    });
  };

  return (
    <Fragment>
      <SmartModal
        open={showAddStudentsListModal}
        onClose={() =>
          setShowAddStudentsListModal(
            (showAddStudentsListModal) => (showAddStudentsListModal = false)
          )
        }
        header="Create New Test using AI"
        showHeader={false}
        size="md"
        centered={false}
        animationType="top"
        scrollable={false}
      >
        {students.length === 0 && (
          <div className="px-6 pb-4 mt-4 bg-white text-center rounded-lg">
            <p className="py-4 text-sm text-gray-400 rounded-lg">
              No students available to add in this batch
            </p>
          </div>
        )}

        {students.length > 0 && (
          <Fragment>
            <div className="w-full py-2 px-6 sticky top-0 bg-white flex items-center justify-between rounded-t-lg">
              <h2 className="w-3/5 font-semibold text-xl">Students List</h2>
              <input
                type="text"
                className="w-2/5 py-1 px-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div className="px-6 pb-6 mt-4 flex flex-col space-y-2">
              {students.map((student, index) => (
                <Fragment key={index}>
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-start space-x-2">
                      <div>
                        <i className="fa-solid fa-user-circle fa-fw fa-lg text-gray-500"></i>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addStudentToBatch(batchId, student.id)}
                      className="py-0.5 px-1.5 font-semibold text-gray-500 border border-gray-200 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <i className="fa-solid fa-plus fa-fw fa-xs"></i>
                    </button>
                  </div>

                  {index !== students.length - 1 && (
                    <hr className="border-gray-100" />
                  )}
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
      </SmartModal>

      <MobileNavbar />
      <div className="mt-2 mb-20 px-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight">Batches</h2>
            <ul className="mt-2 flex items-center space-x-2">
              <li>
                <NavLink to="/batches">
                  <i className="uil uil-object-group text-gray-600"></i>
                </NavLink>
              </li>
              <li>
                <i className="fa-solid fa-chevron-right fa-fw fa-xs text-gray-400"></i>
              </li>
              <li>
                <p className="text-sm text-gray-600">{batch.name}</p>
              </li>
            </ul>
          </div>

          <div className="w-full flex mt-6 pt-4 pb-6 px-6 bg-white border border-gray-200 rounded-lg">
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Student</h3>
                {batchStudents.length > 0 && (
                  <button
                    onClick={openAddStudentsListModal}
                    className="text-xs font-semibold px-3 py-2 border border-gray-200 rounded-lg cursor-pointer"
                  >
                    <i className="fa-solid fa-plus fa-fw"></i>
                    <span>Add Students</span>
                  </button>
                )}
              </div>

              {batchStudents.length === 0 && (
                <div className="w-full mt-6 p-10 bg-white border border-gray-200 text-center rounded-lg">
                  <p className="text-gray-500">
                    Start by adding students to this batch
                  </p>
                  <button
                    className="mt-4 mx-auto pl-3 pr-4 pt-1.5 pb-2 font-semibold text-sm text-white bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
                    onClick={openAddStudentsListModal}
                  >
                    <i className="fa-solid fa-plus fa-fw"></i>{" "}
                    <span>Add Students</span>
                  </button>
                </div>
              )}

              {batchStudents.length > 0 && (
                <div className="w-full mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex flex-col space-y-2">
                    {batchStudents.map((student, index) => (
                      <Fragment key={index}>
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-start space-x-2">
                            <div>
                              <i className="fa-solid fa-user-circle fa-fw fa-lg text-gray-500"></i>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-medium">
                                {student.full_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {student.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeStudentFromBatch(batchId, student.id)
                            }
                            className="py-0.5 px-1.5 font-semibold text-gray-500 border border-gray-200 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-100 rounded-lg cursor-pointer"
                          >
                            <i className="fa-solid fa-minus fa-fw fa-xs"></i>
                          </button>
                        </div>

                        {index !== batchStudents.length - 1 && (
                          <hr className="border-gray-100" />
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
