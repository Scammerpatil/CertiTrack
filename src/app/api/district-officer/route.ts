import DistrictOfficer from "@/models/DistrictOfficer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const districtOfficers = await DistrictOfficer.find();
    return NextResponse.json({ districtOfficers });
  } catch (error) {
    console.error("Error fetching district officers:", error);
    return NextResponse.json(
      { message: "Failed to fetch district officers" },
      { status: 500 }
    );
  }
}
