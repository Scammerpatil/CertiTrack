import dbConfig from "@/middlewares/db.config";
import CertificateOfficer from "@/models/CertificateOfficer";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const certificateOfficerId = searchParams.get("id");

  if (!certificateOfficerId) {
    return NextResponse.json(
      { message: "Certificate Officer ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await CertificateOfficer.findByIdAndDelete(
      certificateOfficerId
    );
    if (result) {
      return NextResponse.json(
        { message: "Certificate Officer deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Certificate Officer not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting certificate officer:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
