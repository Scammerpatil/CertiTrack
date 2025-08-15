import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Affidavit from "@/models/Affidavit";
import BirthCertificate from "@/models/BirthCertificate";
import DomicileCertificate from "@/models/DomicileCertificate";
import NonCreamyLayer from "@/models/NonCreamyLayer";
import IncomeCertificate from "@/models/IncomeCertificate";
import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  try {
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;
    const userId = decodedData.id;
    const subDivisionalOfficer = await SubDivisionalOfficer.findById(userId);
    if (!subDivisionalOfficer) {
      return NextResponse.json(
        { message: "Sub Divisional Officer not found" },
        { status: 404 }
      );
    }
    var applications = [];
    const affidavits = await Affidavit.find({
      ["generalInfo.taluka"]: subDivisionalOfficer.taluka,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const birthCertificates = await BirthCertificate.find({
      ["generalInfo.taluka"]: subDivisionalOfficer.taluka,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const domiciles = await DomicileCertificate.find({
      ["generalInfo.taluka"]: subDivisionalOfficer.taluka,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const nonCreamyLayer = await NonCreamyLayer.find({
      ["generalInfo.taluka"]: subDivisionalOfficer.taluka,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    const incomeCertificates = await IncomeCertificate.find({
      ["generalInfo.taluka"]: subDivisionalOfficer.taluka,
    })
      .populate("applicantId")
      .sort({ createdAt: -1 });

    applications.push(
      ...affidavits,
      ...birthCertificates,
      ...domiciles,
      ...nonCreamyLayer,
      ...incomeCertificates
    );
    applications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ applications });
  } catch (error) {
    console.log("An Error Occured:", error);
    return NextResponse.json(
      { message: "Failed to fetch application history" },
      { status: 500 }
    );
  }
}
