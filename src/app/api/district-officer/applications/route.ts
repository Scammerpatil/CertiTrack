import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Affidavit from "@/models/Affidavit";
import BirthCertificate from "@/models/BirthCertificate";
import DomicileCertificate from "@/models/DomicileCertificate";
import NonCreamyLayer from "@/models/NonCreamyLayer";
import IncomeCertificate from "@/models/IncomeCertificate";
import DistrictOfficer from "@/models/DistrictOfficer";

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
    const districtOfficer = await DistrictOfficer.findById(userId);
    if (!districtOfficer) {
      return NextResponse.json(
        { message: "District Officer not found" },
        { status: 404 }
      );
    }
    var applications = [];
    const affidavits = await Affidavit.find({
      ["generalInfo.district"]: districtOfficer.district,
    }).populate("applicantId");

    const birthCertificates = await BirthCertificate.find({
      ["generalInfo.district"]: districtOfficer.district,
    }).populate("applicantId");

    const domiciles = await DomicileCertificate.find({
      ["generalInfo.district"]: districtOfficer.district,
    }).populate("applicantId");

    const nonCreamyLayer = await NonCreamyLayer.find({
      ["generalInfo.district"]: districtOfficer.district,
    }).populate("applicantId");

    const incomeCertificates = await IncomeCertificate.find({
      ["generalInfo.district"]: districtOfficer.district,
    }).populate("applicantId");

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
