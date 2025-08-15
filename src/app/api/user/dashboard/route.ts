import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Affidavit from "@/models/Affidavit";
import BirthCertificate from "@/models/BirthCertificate";
import DomicileCertificate from "@/models/DomicileCertificate";
import NonCreamyLayer from "@/models/NonCreamyLayer";
import IncomeCertificate from "@/models/IncomeCertificate";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decodedId.id);

    if (!user) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const affidavits = await Affidavit.find({
      applicantId: user._id,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const birthCertificates = await BirthCertificate.find({
      applicantId: user._id,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const domiciles = await DomicileCertificate.find({
      applicantId: user._id,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const nonCreamyLayer = await NonCreamyLayer.find({
      applicantId: user._id,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const incomeCertificates = await IncomeCertificate.find({
      applicantId: user._id,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    // Combine all applications
    const applications = [
      ...affidavits,
      ...birthCertificates,
      ...domiciles,
      ...nonCreamyLayer,
      ...incomeCertificates,
    ];

    applications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Stats
    const totalApplications = applications.length;
    const approvedApplications = applications.filter((app) =>
      app.status.includes("Approved")
    ).length;
    const rejectedApplications = applications.filter((app) =>
      app.status.includes("Rejected")
    ).length;
    const pendingApplications =
      totalApplications - approvedApplications - rejectedApplications;

    // Revenue
    const revenueGenerated =
      affidavits.length * 50 +
      birthCertificates.length * 30 +
      domiciles.length * 40 +
      nonCreamyLayer.length * 60 +
      incomeCertificates.length * 70;

    // ---------------------------
    // Generate Monthly Chart Data
    // ---------------------------
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyData: Record<string, any> = {};
    months.forEach((month) => {
      monthlyData[month] = {
        month,
        Affidavit: 0,
        Domicile: 0,
        Income: 0,
        Birth: 0,
        NonCreamyLayer: 0,
      };
    });

    applications.forEach((app) => {
      const monthName = months[new Date(app.createdAt).getMonth()];
      if (app.type?.includes("Affidavit")) monthlyData[monthName].Affidavit++;
      else if (app.type?.includes("Domicile"))
        monthlyData[monthName].Domicile++;
      else if (app.type?.includes("Income")) monthlyData[monthName].Income++;
      else if (app.type?.includes("Birth")) monthlyData[monthName].Birth++;
      else if (app.type?.includes("Non-Creamy"))
        monthlyData[monthName].NonCreamyLayer++;
    });

    const data = Object.values(monthlyData);

    // ---------------------------
    // Final Response
    // ---------------------------
    const dashboardData = {
      totalApplications,
      revenueGenerated,
      approved: approvedApplications,
      rejected: rejectedApplications,
      pending: pendingApplications,
      recentApplications: applications.slice(0, 5).map((app) => ({
        id: app._id.toString(),
        name: app.generalInfo.fullName,
        type: app.type,
        status: app.status,
        date: app.createdAt.toISOString().split("T")[0],
      })),
      data,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.log("An Error Occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
