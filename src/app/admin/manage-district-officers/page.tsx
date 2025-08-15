"use client";
import { Admin } from "@/types/Admin";
import { DistrictOfficer } from "@/types/DistrictOfficer";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageDistrictOfficersPage = () => {
  const [districtOfficers, setDistrictOfficers] = useState([]);
  const fetchDistrictOfficers = async () => {
    const response = await axios.get("/api/district-officer");
    if (response.data) {
      setDistrictOfficers(response.data.districtOfficers);
    }
  };

  useEffect(() => {
    fetchDistrictOfficers();
  }, []);

  const handleApprove = async (districtOfficerId: string, status: boolean) => {
    const response = axios.patch(
      `/api/district-officer/approve?id=${districtOfficerId}&status=${status}`
    );
    toast.promise(response, {
      loading: "Updating district officer status...",
      success: (data) => {
        fetchDistrictOfficers();
        return (
          data.data.message || "District officer status updated successfully"
        );
      },
      error: (error) => {
        console.log(error);
        return "Failed to update district officer status";
      },
    });
  };

  const handleDelete = async (districtOfficerId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this district officer?")
    ) {
      return;
    }
    const response = axios.delete(
      `/api/district-officer/delete?id=${districtOfficerId}`
    );
    toast.promise(response, {
      loading: "Deleting district officer...",
      success: (data) => {
        fetchDistrictOfficers();
        return data.data.message || "District officer deleted successfully";
      },
      error: (error) => {
        console.log(error);
        return "Failed to delete district officer";
      },
    });
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Manage District Officers
      </h1>
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra bg-base-300">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>District</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {districtOfficers.length > 0 ? (
              districtOfficers.map(
                (districtOfficer: DistrictOfficer, index) => (
                  <tr key={districtOfficer._id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={districtOfficer.profileImage}
                              alt={districtOfficer.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {districtOfficer.name}
                          </div>
                          <div className="text-sm opacity-50">Maharashtra</div>
                        </div>
                      </div>
                    </td>
                    <td>{districtOfficer.district}</td>
                    <td>{districtOfficer.email}</td>
                    <td>{districtOfficer.phone}</td>
                    <th>
                      {districtOfficer.isApproved ? (
                        <button
                          className="btn btn-error font-bold"
                          onClick={() =>
                            handleApprove(districtOfficer._id!, false)
                          }
                        >
                          Revoke Approval
                        </button>
                      ) : (
                        <button
                          className="btn btn-success font-bold"
                          onClick={() =>
                            handleApprove(districtOfficer._id!, true)
                          }
                        >
                          Approve
                        </button>
                      )}
                    </th>
                    <td>
                      <button
                        className="btn btn-error font-bold"
                        onClick={() => handleDelete(districtOfficer._id!)}
                      >
                        <IconTrash size={20} /> Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr key={"no-district-officers"}>
                <td colSpan={7} className="text-center">
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

export default ManageDistrictOfficersPage;
