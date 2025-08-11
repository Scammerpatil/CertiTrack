import dbConfig from "@/middlewares/db.config";
import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";
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
    // find user by email
    const exisitingSDO = await SubDivisionalOfficer.findOne({
      email: formData.email,
      district: formData.district,
      taluka: formData.taluka,
    });
    if (exisitingSDO && exisitingSDO.isApproved) {
      return NextResponse.json(
        { message: "Sub-Divisional Officer already exists" },
        { status: 400 }
      );
    }
    const newSDO = new SubDivisionalOfficer({
      ...formData,
      password: await encryptedPassword,
    });
    await newSDO.save();
    return NextResponse.json(
      { message: "Sub-Divisional Officer created successfully" },
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
