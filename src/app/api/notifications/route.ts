import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Notification from "@/models/Notification";
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const notifications = await Notification.find({
      recipient: decodedData.id,
    }).populate("relatedCertificate");
    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.log("An error occurred while fetching notifications:", error);
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
