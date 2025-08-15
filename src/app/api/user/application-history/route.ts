import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Affidavit from "@/models/Affidavit";
import BirthCertificate from "@/models/BirthCertificate";
import DomicileCertificate from "@/models/DomicileCertificate";
import NonCreamyLayer from "@/models/NonCreamyLayer";
import IncomeCertificate from "@/models/IncomeCertificate";

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
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    var applications = [];
    const affidavits = await Affidavit.find({ applicantId: userId });
    const birthCertificates = await BirthCertificate.find({
      applicantId: userId,
    });
    const domiciles = await DomicileCertificate.find({ applicantId: userId });
    const nonCreamyLayer = await NonCreamyLayer.find({ applicantId: userId });
    const incomeCertificates = await IncomeCertificate.find({
      applicantId: userId,
    });
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
