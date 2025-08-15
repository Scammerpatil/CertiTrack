import Admin from "@/models/Admin";
import CertificateOfficer from "@/models/CertificateOfficer";
import DistrictOfficer from "@/models/DistrictOfficer";
import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  console.log("Updating user:", formData);
  try {
    switch (formData.role) {
      case "admin":
        await Admin.updateOne({ email: formData.email }, formData);
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      case "user":
        await User.updateOne({ email: formData.email }, formData);
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      case "certificate-officer":
        const certificateOfficer = await CertificateOfficer.findOne({
          email: formData.email,
        });
        if (
          formData.district !== certificateOfficer.district ||
          formData.taluka !== certificateOfficer.taluka
        ) {
          formData.isApproved = false;
        }
        await CertificateOfficer.updateOne({ email: formData.email }, formData);
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      case "sub-divisional-officer":
        const subDivisionalOfficer = await SubDivisionalOfficer.findOne({
          email: formData.email,
        });
        if (
          formData.district !== subDivisionalOfficer.district ||
          formData.taluka !== subDivisionalOfficer.taluka
        ) {
          formData.isApproved = false;
        }
        await SubDivisionalOfficer.updateOne(
          { email: formData.email },
          formData
        );
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      case "district-officer":
        const districtOfficer = await DistrictOfficer.findOne({
          email: formData.email,
        });
        if (
          formData.district !== districtOfficer.district ||
          formData.taluka !== districtOfficer.taluka
        ) {
          formData.isApproved = false;
        }
        await DistrictOfficer.updateOne({ email: formData.email }, formData);
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      default:
        return NextResponse.json(
          { error: "Invalid user role" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.log("Something went wrong:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
