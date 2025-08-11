"use client";

import { IconDownload } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

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
    console.log(response.data);
    setCertificates(response.data.applications);
  };
  useEffect(() => {
    fetchCertificates();
  }, []);
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
                  <td>{certificate._id}</td>
                  <td>{certificate.type}</td>
                  <td>{certificate.status}</td>
                  <td>
                    {new Date(certificate.createdAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-2">
                    <button className="btn btn-primary">View</button>
                    <button className="btn btn-secondary">Revoke</button>
                  </td>
                  <td>
                    {certificate.status === "Certificate Issued" ? (
                      <button className="btn btn-warning">
                        <IconDownload size={16} />
                        Download
                      </button>
                    ) : (
                      <button className="btn btn-error">Delete</button>
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
