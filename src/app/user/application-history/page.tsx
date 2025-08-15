"use client";

import { IconDownload, IconEye, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Certificates {
  _id: string;
  type: string;
  status: string;
  createdAt: Date;
}
export default function ApplicationHistoryPage() {
  const [certificates, setCertificates] = useState<Certificates[]>([]);
  const fetchCertificates = async () => {
    const response = await axios.get("/api/user/application-history");
    setCertificates(response.data.applications);
  };
  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleApplicationDelete = async (id: string, type: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        const res = axios.delete(
          `/api/certificate/delete?id=${id}&type=${type}`
        );
        toast.promise(res, {
          loading: "Deleting...",
          success: () => {
            fetchCertificates();
            return "Application deleted successfully!";
          },
          error: "Error deleting application.",
        });
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };
  const handleApplicationDownload = async (id: string, type: string) => {
    const res = axios.get(
      `/api/certificate/${type
        .split(" ")
        .join("-")
        .toLowerCase()}/download?id=${id}&type=${type}`,
      {
        responseType: "blob",
      }
    );
    toast.promise(res, {
      loading: "Downloading...",
      success: (data) => {
        const url = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${id}-${type}.pdf`);
        document.body.appendChild(link);
        link.click();
        return "Download successful!";
      },
      error: "Error downloading file.",
    });
  };
  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Your Application History
      </h1>
      <div className="overflow-x-auto mt-6 bg-base-300 rounded-2xl">
        <table className="table table-zebra w-full">
          <thead className="bg-base-300/80">
            <tr>
              <th>#</th>
              <th>Certificate ID</th>
              <th>Certificate Type</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>View Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 ? (
              <tr key="no-certificates">
                <td colSpan={7} className="text-center">
                  No application history found.
                </td>
              </tr>
            ) : (
              certificates.map((certificate, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link
                      href={`/user/view-details?id=${certificate._id}&type=${certificate.type}`}
                    >
                      {certificate._id}
                    </Link>
                  </td>
                  <td>{certificate.type}</td>
                  <td>{certificate.status}</td>
                  <td>
                    {new Date(certificate.createdAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-2">
                    <Link
                      href={`/user/view-details?id=${certificate._id}&type=${certificate.type}`}
                      className="btn btn-primary"
                    >
                      <IconEye size={16} />
                      View
                    </Link>
                  </td>
                  <td>
                    {certificate.status === "Certificate Issued" ? (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleApplicationDownload(
                            certificate._id,
                            certificate.type
                          )
                        }
                      >
                        <IconDownload size={16} />
                        Download
                      </button>
                    ) : (
                      <span className="badge badge-accent">Not Available</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
