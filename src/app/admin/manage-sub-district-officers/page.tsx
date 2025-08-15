"use client";
import { SubDivisionalOfficer } from "@/types/SubDivisionalOfficer";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageSubDivisionalOfficer = () => {
  const [subDivisionalOfficers, setSubDivisionalOfficers] = useState([]);
  const fetchSubDivisionalOfficers = async () => {
    const response = await axios.get("/api/sub-divisional-officer");
    if (response.data) {
      setSubDivisionalOfficers(response.data.subDivisionalOfficers);
    }
  };

  useEffect(() => {
    fetchSubDivisionalOfficers();
  }, []);

  const handleApprove = async (
    subDivisionalOfficerId: string,
    status: boolean
  ) => {
    const response = axios.patch(
      `/api/sub-divisional-officer/approve?id=${subDivisionalOfficerId}&status=${status}`
    );
    toast.promise(response, {
      loading: "Updating sub-divisional officer status...",
      success: (data) => {
        fetchSubDivisionalOfficers();
        return (
          data.data.message ||
          "Sub-divisional officer status updated successfully"
        );
      },
      error: (error) => {
        console.log(error);
        return "Failed to update sub-divisional officer status";
      },
    });
  };

  const handleDelete = async (subDivisionalOfficerId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this sub-divisional officer?"
      )
    ) {
      return;
    }
    const response = axios.delete(
      `/api/sub-divisional-officer/delete?id=${subDivisionalOfficerId}`
    );
    toast.promise(response, {
      loading: "Deleting sub-divisional officer...",
      success: (data) => {
        fetchSubDivisionalOfficers();
        return (
          data.data.message || "Sub-divisional officer deleted successfully"
        );
      },
      error: (error) => {
        console.log(error);
        return "Failed to delete sub-divisional officer";
      },
    });
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Manage Sub-Divisional Officers
      </h1>
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra bg-base-300">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>District</th>
              <th>Taluka</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subDivisionalOfficers.length > 0 ? (
              subDivisionalOfficers.map(
                (subDivisionalOfficer: SubDivisionalOfficer, index) => (
                  <tr key={subDivisionalOfficer._id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={subDivisionalOfficer.profileImage}
                              alt={subDivisionalOfficer.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {subDivisionalOfficer.name}
                          </div>
                          <div className="text-sm opacity-50">Maharashtra</div>
                        </div>
                      </div>
                    </td>
                    <td>{subDivisionalOfficer.district}</td>
                    <td>{subDivisionalOfficer.taluka}</td>
                    <td>{subDivisionalOfficer.email}</td>
                    <td>{subDivisionalOfficer.phone}</td>
                    <th>
                      {subDivisionalOfficer.isApproved ? (
                        <button
                          className="btn btn-error font-bold"
                          onClick={() =>
                            handleApprove(subDivisionalOfficer._id!, false)
                          }
                        >
                          Revoke Approval
                        </button>
                      ) : (
                        <button
                          className="btn btn-success font-bold"
                          onClick={() =>
                            handleApprove(subDivisionalOfficer._id!, true)
                          }
                        >
                          Approve
                        </button>
                      )}
                    </th>
                    <td>
                      <button
                        className="btn btn-error font-bold"
                        onClick={() => handleDelete(subDivisionalOfficer._id!)}
                      >
                        <IconTrash size={20} /> Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr key={"no-district-officers"}>
                <td colSpan={8} className="text-center">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageSubDivisionalOfficer;
