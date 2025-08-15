"use client";

import { useUser } from "@/context/UserContext";
import { DashboardData } from "@/types/DashboardData";
import {
  IconCheck,
  IconCircleDashedX,
  IconForms,
  IconMoneybag,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SDODashboard() {
  const { user } = useUser();
  const [dashboardData, setDashboard] = useState<DashboardData>();
  const fetchDashboardData = async () => {
    const response = await axios.get("/api/admin/dashboard");
    setDashboard(response.data);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="stats shadow w-full bg-base-200">
        <div className="stat shadow">
          <div className="stat-figure text-primary">
            <IconForms size={24} />
          </div>
          <div className="stat-title">Total Applications</div>
          <div className="stat-value">
            {dashboardData?.totalApplications || 0}
          </div>
        </div>
        <div className="stat shadow">
          <div className="stat-figure text-success">
            <IconMoneybag size={24} />
          </div>
          <div className="stat-title">Revenue Generated</div>
          <div className="stat-value text-success">
            {dashboardData?.revenueGenerated || 0} ₹
          </div>
        </div>
        <div className="stat shadow">
          <div className="stat-figure text-primary">
            <IconCheck size={24} />
          </div>
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">
            {dashboardData?.approved || 0}
          </div>
        </div>
        <div className="stat shadow">
          <div className="stat-figure text-error">
            <IconCircleDashedX size={24} />
          </div>
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-error">
            {dashboardData?.rejected || 0}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar avatar-online">
              <div className="w-16 rounded-full">
                <img src={user?.profileImage} />
              </div>
            </div>
          </div>
          <div className="stat-value">{dashboardData?.pending || 0}</div>
          <div className="stat-title">Pending Applications</div>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-base-200 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 py-2 text-center uppercase">
          Applications per Month
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData?.data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Affidavit" fill="#4f46e5" />
            <Bar dataKey="Domicile" fill="#22c55e" />
            <Bar dataKey="Income" fill="#f59e0b" />
            <Bar dataKey="Birth" fill="#ef4444" />
            <Bar dataKey="NonCreamyLayer" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-base-200 p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 py-2 text-center uppercase">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full bg-base-300">
            <thead className="bg-base-100">
              <tr>
                <th>Application ID</th>
                <th>Applicant</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recentApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    No recent applications found.
                  </td>
                </tr>
              ) : (
                dashboardData?.recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.name}</td>
                    <td>{app.type}</td>
                    <td>
                      <span
                        className={`badge ${
                          app.status.includes("Approved") ||
                          app.status.includes("Certificate Issued") ||
                          app.status.includes("Verified")
                            ? "badge-success"
                            : app.status.includes("Pending")
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>{app.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
