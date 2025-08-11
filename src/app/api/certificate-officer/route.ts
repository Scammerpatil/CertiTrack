import CertificateOfficer from "@/models/CertificateOfficer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const certificateOfficers = await CertificateOfficer.find();
    return NextResponse.json({ certificateOfficers });
  } catch (error) {
    console.error("Error fetching certificate officers:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificate officers" },
      { status: 500 }
    );
  }
}
