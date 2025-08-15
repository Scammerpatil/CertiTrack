"use client";
import { CertificateOfficer } from "@/types/CertificateOfficer";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageCertificateOfficerPage = () => {
  const [certificateOfficers, setCertificateOfficers] = useState([]);
  const fetchCertificateOfficers = async () => {
    const response = await axios.get("/api/certificate-officer");
    if (response.data) {
      setCertificateOfficers(response.data.certificateOfficers);
    }
  };

  useEffect(() => {
    fetchCertificateOfficers();
  }, []);

  const handleApprove = async (
    certificateOfficerId: string,
    status: boolean
  ) => {
    const response = axios.patch(
      `/api/certificate-officer/approve?id=${certificateOfficerId}&status=${status}`
    );
    toast.promise(response, {
      loading: "Updating certificate officer status...",
      success: (data) => {
        fetchCertificateOfficers();
        return (
          data.data.message || "Certificate officer status updated successfully"
        );
      },
      error: (error) => {
        console.log(error);
        return "Failed to update certificate officer status";
      },
    });
  };

  const handleDelete = async (certificateOfficerId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this certificate officer?"
      )
    ) {
      return;
    }
    const response = axios.delete(
      `/api/certificate-officer/delete?id=${certificateOfficerId}`
    );
    toast.promise(response, {
      loading: "Deleting certificate officer...",
      success: (data) => {
        fetchCertificateOfficers();
        return data.data.message || "Certificate officer deleted successfully";
      },
      error: (error) => {
        console.log(error);
        return "Failed to delete certificate officer";
      },
    });
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Manage Certificate Officers
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
            {certificateOfficers.length > 0 ? (
              certificateOfficers.map(
                (certificateOfficer: CertificateOfficer, index) => (
                  <tr key={certificateOfficer._id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={certificateOfficer.profileImage}
                              alt={certificateOfficer.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {certificateOfficer.name}
                          </div>
                          <div className="text-sm opacity-50">Maharashtra</div>
                        </div>
                      </div>
                    </td>
                    <td>{certificateOfficer.district}</td>
                    <td>{certificateOfficer.taluka}</td>
                    <td>{certificateOfficer.email}</td>
                    <td>{certificateOfficer.phone}</td>
                    <th>
                      {certificateOfficer.isApproved ? (
                        <button
                          className="btn btn-error font-bold"
                          onClick={() =>
                            handleApprove(certificateOfficer._id!, false)
                          }
                        >
                          Revoke Approval
                        </button>
                      ) : (
                        <button
                          className="btn btn-success font-bold"
                          onClick={() =>
                            handleApprove(certificateOfficer._id!, true)
                          }
                        >
                          Approve
                        </button>
                      )}
                    </th>
                    <td>
                      <button
                        className="btn btn-error font-bold"
                        onClick={() => handleDelete(certificateOfficer._id!)}
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
                  No certificate officers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageCertificateOfficerPage;
