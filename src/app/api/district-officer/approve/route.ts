import Admin from "@/models/Admin";
import DistrictOfficer from "@/models/DistrictOfficer";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const searchparams = req.nextUrl.searchParams;
  const districtOfficerId = searchparams.get("id");
  const status = searchparams.get("status");
  if (!districtOfficerId || !status) {
    return NextResponse.json(
      { message: "District Officer ID and status are required" },
      { status: 400 }
    );
  }
  try {
    const districtOfficer = await DistrictOfficer.findById(districtOfficerId);
    if (!districtOfficer) {
      return NextResponse.json(
        { message: "District Officer not found" },
        { status: 404 }
      );
    }
    await DistrictOfficer.findByIdAndUpdate(districtOfficerId, {
      isApproved: status,
    });
    return NextResponse.json(
      { message: "District Officer status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
