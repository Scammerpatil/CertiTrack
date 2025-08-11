import dbConfig from "@/middlewares/db.config";
import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subDivisionalOfficerId = searchParams.get("id");

  if (!subDivisionalOfficerId) {
    return NextResponse.json(
      { message: "Sub Divisional Officer ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await SubDivisionalOfficer.findByIdAndDelete(
      subDivisionalOfficerId
    );
    if (result) {
      return NextResponse.json(
        { message: "Sub Divisional Officer deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "District Officer not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting sub divisional officer:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
