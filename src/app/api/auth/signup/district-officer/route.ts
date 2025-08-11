import DistrictOfficer from "@/models/DistrictOfficer";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

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
    const exisitingDO = await DistrictOfficer.findOne({
      email: formData.email,
      district: formData.district,
    });
    if (exisitingDO && exisitingDO.isApproved) {
      return NextResponse.json(
        { message: "District Officer already exists" },
        { status: 400 }
      );
    }
    const newDO = new DistrictOfficer({
      ...formData,
      password: await encryptedPassword,
    });
    await newDO.save();
    return NextResponse.json(
      { message: "District Officer created successfully" },
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
