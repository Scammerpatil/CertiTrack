import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import Affidavit from "@/models/Affidavit";
import IncomeCertificate from "@/models/IncomeCertificate";

export async function DELETE(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // 2. Get params
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    if (!id || !type) {
      return NextResponse.json(
        { message: "Certificate ID and type are required" },
        { status: 400 }
      );
    }

    // 3. Get the certificate model
    let Model;
    switch (type) {
      case "Affidavit":
        Model = Affidavit;
        break;
      case "Income Certificate":
        Model = IncomeCertificate;
        break;
      default:
        return NextResponse.json(
          { message: "Invalid certificate type" },
          { status: 400 }
        );
    }

    // 4. Find certificate
    const certificate = await Model.findById(id);
    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }
    if (certificate.applicantId.toString() !== decoded.id) {
      return NextResponse.json(
        { message: "You are not authorized to delete this certificate" },
        { status: 403 }
      );
    }

    // 5. Extract folder path from proofOfIdentity.fileUrl
    // Example: /affidavit/6898b7d92eeb6e4ba058674c-1754972307941/proofOfIdentity-abc.pdf
    const fileUrl = certificate.proofOfIdentity.fileUrl;
    const folderPath = path.join(
      process.cwd(),
      "public",
      fileUrl.split("/").slice(0, -1).join("/") // remove the file name
    );

    // 6. Delete the folder and all its contents
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // 7. Remove from DB
    await certificate.deleteOne();

    return NextResponse.json(
      { message: "Certificate and files deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
