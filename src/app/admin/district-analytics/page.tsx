"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DistrictAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/admin/district-analytics")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        District-wise Analytics
      </h1>

      {/* Graph */}
      <div className="bg-base-300 p-4 rounded-xl shadow mt-6">
        <h2 className="text-xl font-semibold mb-4 uppercase text-center">
          Applications Overview
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="district" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="approved" fill="#4ade80" name="Approved" />
            <Bar dataKey="rejected" fill="#f87171" name="Rejected" />
            <Bar dataKey="pending" fill="#facc15" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-base-300 p-4 rounded-xl shadow overflow-x-auto mt-6">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>District</th>
              <th>Total</th>
              <th>Approved</th>
              <th>Rejected</th>
              <th>Pending</th>
              <th>Revenue (₹)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d: any, i) => (
              <tr key={i}>
                <td>{d.district}</td>
                <td>{d.total}</td>
                <td className="text-success">{d.approved}</td>
                <td className="text-error">{d.rejected}</td>
                <td className="text-warning">{d.pending}</td>
                <td className="font-semibold">₹{d.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
