import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const searchparams = req.nextUrl.searchParams;
  const subDivisionalOfficerId = searchparams.get("id");
  const status = searchparams.get("status");
  if (!subDivisionalOfficerId || !status) {
    return NextResponse.json(
      { message: "Sub Divisional Officer ID and status are required" },
      { status: 400 }
    );
  }
  try {
    const subDivisionalOfficer = await SubDivisionalOfficer.findById(
      subDivisionalOfficerId
    );
    if (!subDivisionalOfficer) {
      return NextResponse.json(
        { message: "Sub Divisional Officer not found" },
        { status: 404 }
      );
    }
    await SubDivisionalOfficer.findByIdAndUpdate(subDivisionalOfficerId, {
      isApproved: status,
    });
    return NextResponse.json(
      { message: "Sub Divisional Officer status updated successfully" },
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
