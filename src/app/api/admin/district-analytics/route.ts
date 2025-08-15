// src/app/api/admin/district-analytics/route.ts
import { NextResponse } from "next/server";
import Affidavit from "@/models/Affidavit";
import BirthCertificate from "@/models/BirthCertificate";
import DomicileCertificate from "@/models/DomicileCertificate";
import NonCreamyLayer from "@/models/NonCreamyLayer";
import IncomeCertificate from "@/models/IncomeCertificate";

export async function GET() {
  try {
    const collections = [
      { model: Affidavit, type: "Affidavit", fee: 50 },
      { model: BirthCertificate, type: "BirthCertificate", fee: 30 },
      { model: DomicileCertificate, type: "DomicileCertificate", fee: 40 },
      { model: NonCreamyLayer, type: "NonCreamyLayer", fee: 60 },
      { model: IncomeCertificate, type: "IncomeCertificate", fee: 70 },
    ];

    const districtStats: Record<
      string,
      {
        total: number;
        approved: number;
        rejected: number;
        pending: number;
        revenue: number;
      }
    > = {};

    for (const { model, fee } of collections) {
      const records = await model.find();

      records.forEach((r) => {
        const district = r.generalInfo?.district || "Unknown";

        if (!districtStats[district]) {
          districtStats[district] = {
            total: 0,
            approved: 0,
            rejected: 0,
            pending: 0,
            revenue: 0,
          };
        }

        districtStats[district].total += 1;
        if (
          r.status.includes("Approved") ||
          r.status.includes("Verified") ||
          r.status.includes("Issued")
        ) {
          districtStats[district].approved += 1;
          districtStats[district].revenue += fee;
        } else if (r.status.includes("Rejected")) {
          districtStats[district].rejected += 1;
        } else {
          districtStats[district].pending += 1;
        }
      });
    }

    const tableData = Object.entries(districtStats).map(
      ([district, stats]) => ({
        district,
        ...stats,
      })
    );

    return NextResponse.json(tableData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
