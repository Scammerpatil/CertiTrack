import dbConfig from "@/middlewares/db.config";
import CertificateOfficer from "@/models/CertificateOfficer";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  if (!formData.email || !formData.password) {
    return NextResponse.json(
      { message: "Please fill all the fields" },
      { status: 400 }
    );
  }
  try {
    const encryptedPassword = bcrypt.hash(formData.password, 10);
    const newCO = new CertificateOfficer({
      ...formData,
      password: await encryptedPassword,
    });
    await newCO.save();
    return NextResponse.json(
      { message: "Certificate Officer created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
