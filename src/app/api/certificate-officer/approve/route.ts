import CertificateOfficer from "@/models/CertificateOfficer";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const searchparams = req.nextUrl.searchParams;
  const certificateOfficerId = searchparams.get("id");
  const status = searchparams.get("status");
  if (!certificateOfficerId || !status) {
    return NextResponse.json(
      { message: "Certificate Officer ID and status are required" },
      { status: 400 }
    );
  }
  try {
    const certificateOfficer = await CertificateOfficer.findById(
      certificateOfficerId
    );
    if (!certificateOfficer) {
      return NextResponse.json(
        { message: "Certificate Officer not found" },
        { status: 404 }
      );
    }
    await CertificateOfficer.findByIdAndUpdate(certificateOfficerId, {
      isApproved: status,
    });
    return NextResponse.json(
      { message: "Certificate Officer status updated successfully" },
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
