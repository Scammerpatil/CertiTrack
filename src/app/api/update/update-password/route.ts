import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import CertificateOfficer from "@/models/CertificateOfficer";
import DistrictOfficer from "@/models/DistrictOfficer";
import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    switch (decodedId.role) {
      case "admin":
        const admin = await Admin.findById(decodedId.id);
        if (!admin) {
          return NextResponse.json(
            { error: "Admin not found" },
            { status: 404 }
          );
        }
        if (bcrypt.compareSync(currentPassword, admin.password)) {
          admin.password = bcrypt.hashSync(newPassword, 10);
          await admin.save();
          return NextResponse.json({
            message: "Password updated successfully",
          });
        } else {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
          );
        }
        break;
      case "user":
        const user = await User.findById(decodedId.id);
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        if (bcrypt.compareSync(currentPassword, user.password)) {
          user.password = bcrypt.hashSync(newPassword, 10);
          await user.save();
          return NextResponse.json({
            message: "Password updated successfully",
          });
        } else {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
          );
        }
      case "certificate-officer":
        const certificateOfficer = await CertificateOfficer.findById(
          decodedId.id
        );
        if (!certificateOfficer) {
          return NextResponse.json(
            { error: "Certificate Officer not found" },
            { status: 404 }
          );
        }
        if (bcrypt.compareSync(currentPassword, certificateOfficer.password)) {
          certificateOfficer.password = bcrypt.hashSync(newPassword, 10);
          await certificateOfficer.save();
          return NextResponse.json({
            message: "Password updated successfully",
          });
        } else {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
          );
        }
      case "district-officer":
        const districtOfficer = await DistrictOfficer.findById(decodedId.id);
        if (!districtOfficer) {
          return NextResponse.json(
            { error: "District Officer not found" },
            { status: 404 }
          );
        }
        if (bcrypt.compareSync(currentPassword, districtOfficer.password)) {
          districtOfficer.password = bcrypt.hashSync(newPassword, 10);
          await districtOfficer.save();
          return NextResponse.json({
            message: "Password updated successfully",
          });
        } else {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
          );
        }
      case "sub-divisional-officer":
        const subDivisionalOfficer = await SubDivisionalOfficer.findById(
          decodedId.id
        );
        if (!subDivisionalOfficer) {
          return NextResponse.json(
            { error: "Sub Divisional Officer not found" },
            { status: 404 }
          );
        }
        if (
          bcrypt.compareSync(currentPassword, subDivisionalOfficer.password)
        ) {
          subDivisionalOfficer.password = bcrypt.hashSync(newPassword, 10);
          await subDivisionalOfficer.save();
          return NextResponse.json({
            message: "Password updated successfully",
          });
        } else {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
          );
        }
      default:
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Failed to update password", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
