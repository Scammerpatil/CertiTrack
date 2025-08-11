"use client";
import { Admin } from "@/types/Admin";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const fetchAdmins = async () => {
    const response = await axios.get("/api/admin");
    if (response.data) {
      console.log(response.data.admins);
      setAdmins(response.data.admins);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleApprove = async (adminId: string, status: boolean) => {
    const response = axios.patch(
      `/api/admin/approve?id=${adminId}&status=${status}`
    );
    toast.promise(response, {
      loading: "Updating admin status...",
      success: (data) => {
        fetchAdmins();
        return data.data.message || "Admin status updated successfully";
      },
      error: (error) => {
        console.log(error);
        return "Failed to update admin status";
      },
    });
  };

  const handleDelete = async (adminId: string) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }
    const response = axios.delete(`/api/admin/delete?id=${adminId}`);
    toast.promise(response, {
      loading: "Deleting admin...",
      success: (data) => {
        fetchAdmins();
        return data.data.message || "Admin deleted successfully";
      },
      error: (error) => {
        console.log(error);
        return "Failed to delete admin";
      },
    });
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Manage Admins
      </h1>
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra bg-base-300">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin: Admin, index) => (
                <tr key={admin._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={admin.profileImage} alt={admin.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{admin.name}</div>
                        <div className="text-sm opacity-50">{admin.state}</div>
                      </div>
                    </div>
                  </td>
                  <td>{admin.email}</td>
                  <td>{admin.phone}</td>
                  <th>
                    {admin.isApproved ? (
                      <button
                        className="btn btn-error font-bold"
                        onClick={() => handleApprove(admin._id!, false)}
                      >
                        Revoke Approval
                      </button>
                    ) : (
                      <button
                        className="btn btn-success font-bold"
                        onClick={() => handleApprove(admin._id!, true)}
                      >
                        Approve
                      </button>
                    )}
                  </th>
                  <td>
                    <button
                      className="btn btn-error font-bold"
                      onClick={() => handleDelete(admin._id!)}
                    >
                      <IconTrash size={20} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={"no-admins"}>
                <td colSpan={6} className="text-center">
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

export default ManageAdminsPage;
