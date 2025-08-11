import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subDivisionalOfficers = await SubDivisionalOfficer.find();
    return NextResponse.json({ subDivisionalOfficers });
  } catch (error) {
    console.error("Error fetching sub-divisional officers:", error);
    return NextResponse.json(
      { message: "Failed to fetch sub-divisional officers" },
      { status: 500 }
    );
  }
}
