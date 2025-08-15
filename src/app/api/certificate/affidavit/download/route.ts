import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import PizZip from "pizzip";
import docxtemplater from "docxtemplater";
import Affidavit from "@/models/Affidavit";
import DistrictOfficer from "@/models/DistrictOfficer";
import dbConfig from "@/middlewares/db.config";

const execPromise = promisify(exec);

dbConfig();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json(
        { message: "Missing id or type" },
        { status: 400 }
      );
    }

    // Ensure tmp folder exists
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    // Load template
    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      "affidavit.docx"
    );
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 }
      );
    }

    // Fetch application
    const application = await Affidavit.findById(id);
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    // Load district officer
    const districtOfficer = await DistrictOfficer.findOne({
      district: application.generalInfo.district,
    });

    // Fill template
    const zip = new PizZip(fs.readFileSync(templatePath));
    const doc = new docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      certificateNumber: application._id,
      proofOfIdentity: application.proofOfIdentity.type,
      proofOfAddress: application.proofOfAddress.type,
      fullName: application.generalInfo.fullName,
      taluka: application.generalInfo.taluka,
      district: application.generalInfo.district,
      authorityName: districtOfficer?.name || "",
      date: new Date().toLocaleDateString(),
      year: new Date().getFullYear(),
    });

    const docxPath = path.join(tmpDir, `${id}.docx`);
    const pdfPath = path.join(tmpDir, `${id}.pdf`);

    fs.writeFileSync(
      docxPath,
      doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" })
    );

    await execPromise(
      `py -3.12  python/docxtopdf.py "${docxPath}" "${pdfPath}"`
    );
    const pdfbuf = fs.readFileSync(pdfPath);
    fs.unlinkSync(docxPath);
    fs.unlinkSync(pdfPath);
    return new NextResponse(pdfbuf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${id}-${type}.pdf`,
      },
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
