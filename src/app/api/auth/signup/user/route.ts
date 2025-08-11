import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
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
  // Check if user already exists
  const existingUser = await User.findOne({ email: formData.email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }
  const existingUserWithPhone = await User.findOne({ phone: formData.phone });
  if (existingUserWithPhone) {
    return NextResponse.json(
      { message: "User with this phone number already exists" },
      { status: 400 }
    );
  }
  try {
    const encryptedPassword = bcrypt.hash(formData.password, 10);
    const newUser = new User({
      ...formData,
      password: await encryptedPassword,
    });
    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
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
