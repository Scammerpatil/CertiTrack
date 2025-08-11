import dbConfig from "@/middlewares/db.config";
import Admin from "@/models/Admin";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("id");

  if (!adminId) {
    return NextResponse.json(
      { message: "Admin ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await Admin.findByIdAndDelete(adminId);
    if (result) {
      return NextResponse.json(
        { message: "Admin deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
