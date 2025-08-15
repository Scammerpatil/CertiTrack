"use client";
import { Application } from "@/types/Application";
import { IconFilter } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const fetchApplications = async () => {
    const response = await fetch("/api/district-officer/applications");
    const data = await response.json();
    setApplications(data.applications || []);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (
    appId: string,
    remark: string,
    status: boolean
  ) => {
    if (!appId || !remark || status === null) {
      toast.error("Please fill all fields");
      return;
    }
    const response = axios.patch("/api/certificate/update-application", {
      remark,
      status: status ? "Certificate Issued" : "Rejected By DO",
      appId: appId,
      officer: "DO",
      applicationType: applications.find((app) => app._id === appId)?.type,
    });
    toast.promise(response, {
      loading: "Updating...",
      success: () => {
        fetchApplications();
        return "Updated successfully!";
      },
      error: "Error updating application",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setSortBy("");
  };

  // Derived filtered list
  const filteredApplications = useMemo(() => {
    let data = [...applications];

    // Filter by search
    if (searchTerm.trim()) {
      data = data.filter(
        (app) =>
          app.applicantId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      data = data.filter((app) => app.status === statusFilter);
    }

    // Filter by type
    if (typeFilter) {
      data = data.filter((app) => app.type === typeFilter);
    }

    // Sort
    if (sortBy) {
      switch (sortBy) {
        case "date-asc":
          data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "date-desc":
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "name-asc":
          data.sort((a, b) =>
            a.applicantId.name.localeCompare(b.applicantId.name)
          );
          break;
        case "name-desc":
          data.sort((a, b) =>
            b.applicantId.name.localeCompare(a.applicantId.name)
          );
          break;
      }
    }

    return data;
  }, [applications, searchTerm, statusFilter, typeFilter, sortBy]);

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">Applications</h1>
      <div className="mt-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input
            type="text"
            placeholder="Search by applicant name or application Id"
            className="input input-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select select-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {[
              "Pending at CO",
              "Verified by CO",
              "Approved by SDO",
              "Approved by DO",
              "Certificate Issued",
              "Rejected By CO",
              "Rejected By SDO",
              "Rejected By DO",
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="select select-primary"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {[
              "Affidavit",
              "Birth Certificate",
              "Domicile Certificate",
              "Non-Creamy Layer Certificate",
              "Income Certificate",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="select select-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="date-desc">Date (Newest First)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
          <button className="btn btn-primary" onClick={clearFilters}>
            <IconFilter /> Clear Filter
          </button>
        </div>

        <div className="overflow-x-auto mt-6 bg-base-300 rounded-2xl">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Application Id</th>
                <th>Applicant Details</th>
                <th>Application Type</th>
                <th>Status</th>
                <th>Application Date</th>
                <th>Remarks by CO</th>
                <th>Remark by SDO</th>
                <th>Remark by DO</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app, index) => (
                  <tr key={app._id}>
                    <th>{index + 1}</th>
                    <td>
                      <Link
                        href={`/district-officer/view-details?id=${app._id}&type=${app.type}`}
                      >
                        {app._id}
                      </Link>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={app.applicantId.profileImage}
                              alt={app.applicantId.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {app.applicantId.name}
                          </div>
                          <div className="text-sm opacity-50">
                            {app.generalInfo.taluka}, {app.generalInfo.district}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold">{app.type}</div>
                    </td>
                    <td>{app.status}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <th>{app.remarkByCO || "Application Pending"}</th>
                    <th>{app.remarkBySDO || "Application Pending"}</th>
                    <th className="space-x-3">
                      {app.status === "Rejected By CO" ? (
                        <>Application Rejected By CO</>
                      ) : app.status === "Rejected By SDO" ? (
                        <>Application Rejected By SDO</>
                      ) : app.status === "Certificate Issued" ||
                        app.status.includes("Approved") ? (
                        app.remarkByDO ? (
                          <span>{app.remarkByDO}</span>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder="Remarks"
                              className="input input-bordered mb-2"
                              value={remarks[app._id] || ""}
                              onChange={(e) =>
                                setRemarks((prev) => ({
                                  ...prev,
                                  [app._id]: e.target.value,
                                }))
                              }
                            />
                            <div className="flex space-x-2">
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  handleStatusChange(
                                    app._id,
                                    remarks[app._id],
                                    true
                                  )
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-error"
                                onClick={() =>
                                  handleStatusChange(
                                    app._id,
                                    remarks[app._id],
                                    false
                                  )
                                }
                              >
                                Reject
                              </button>
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          <span className="text-sm opacity-50">No Remarks</span>
                        </div>
                      )}
                    </th>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
