import dbConfig from "@/middlewares/db.config";
import Admin from "@/models/Admin";
import CertificateOfficer from "@/models/CertificateOfficer";
import DistrictOfficer from "@/models/DistrictOfficer";
import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };
    if (!data) {
      return NextResponse.json({ error: "Invalid token" });
    }
    switch (data.role) {
      case "super-admin":
        return NextResponse.json({ user: data, status: 200 });
      case "admin":
        const admin = await Admin.findById(data.id).select("-password");
        if (!admin) {
          return NextResponse.json({ error: "Admin not found" });
        }
        return NextResponse.json({ user: admin, status: 200 });
      case "district-officer":
        const districtOfficer = await DistrictOfficer.findById(data.id).select(
          "-password"
        );
        if (!districtOfficer) {
          return NextResponse.json({ error: "District Officer not found" });
        }
        return NextResponse.json({ user: districtOfficer, status: 200 });
      case "sub-divisional-officer":
        const subDivisionalOfficer = await SubDivisionalOfficer.findById(
          data.id
        ).select("-password");
        if (!subDivisionalOfficer) {
          return NextResponse.json({
            error: "Sub Divisional Officer not found",
          });
        }
        return NextResponse.json({ user: subDivisionalOfficer, status: 200 });
      case "certificate-officer":
        const certificateOfficer = await CertificateOfficer.findById(
          data.id
        ).select("-password");
        if (!certificateOfficer) {
          return NextResponse.json({
            error: "Certificate Officer not found",
          });
        }
        return NextResponse.json({ user: certificateOfficer, status: 200 });
      case "user":
        const user = await User.findById(data.id).select("-password");
        if (!user) {
          return NextResponse.json({ error: "User not found" });
        }
        return NextResponse.json({ user, status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 401 });
  }
}
