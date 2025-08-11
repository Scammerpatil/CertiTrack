import dbConfig from "@/middlewares/db.config";
import DistrictOfficer from "@/models/DistrictOfficer";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const districtOfficerId = searchParams.get("id");

  if (!districtOfficerId) {
    return NextResponse.json(
      { message: "District Officer ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await DistrictOfficer.findByIdAndDelete(districtOfficerId);
    if (result) {
      return NextResponse.json(
        { message: "District Officer deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "District Officer not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting district officer:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
