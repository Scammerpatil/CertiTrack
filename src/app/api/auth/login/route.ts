import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import Admin from "@/models/Admin";
import DistrictOfficer from "@/models/DistrictOfficer";
import SubDivisionalOfficer from "@/models/SubDivisionalOfficer";
import CertificateOfficer from "@/models/CertificateOfficer";
import User from "@/models/User";

dbConfig();

const ROLE_CONFIG = {
  admin: { model: Admin, route: "/admin/dashboard" },
  "district-officer": {
    model: DistrictOfficer,
    route: "/district-officer/dashboard",
  },
  "sub-divisional-officer": {
    model: SubDivisionalOfficer,
    route: "/sub-divisional-officer/dashboard",
  },
  "certificate-officer": {
    model: CertificateOfficer,
    route: "/certificate-officer/dashboard",
  },
  user: { model: User, route: "/user/dashboard" },
};

const createTokenAndResponse = (data: object, route: string) => {
  const token = jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "7d" });
  const response = NextResponse.json({
    message: "Login successful",
    route,
    token,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
  });
  return response;
};

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  const { email, password, role } = formData || {};
  type RoleKey = keyof typeof ROLE_CONFIG;
  console.log(email, role);
  if (!email || !password) {
    return NextResponse.json(
      { message: "Please fill all the fields" },
      { status: 400 }
    );
  }
  try {
    // Super admin shortcut
    if (email === "admin@certitrack.com" && password === "Admin@123") {
      return createTokenAndResponse(
        {
          id: "super-admin",
          email,
          role: "super-admin",
          name: "Super Admin",
          profileImage:
            "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
          isApproved: true,
        },
        "/super-admin/dashboard"
      );
    }

    const config = ROLE_CONFIG[role as RoleKey];
    if (!config) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const account = await config.model.findOne({ email });
    if (!account) {
      return NextResponse.json(
        { message: `${role.replace("-", " ")} not found` },
        { status: 404 }
      );
    }

    if (!bcrypt.compareSync(password, account.password)) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const data = {
      id: account.id,
      name: account.name,
      profileImage: account.profileImage,
      email: account.email,
      role,
      isApproved: account.isApproved ?? true,
    };

    return createTokenAndResponse(data, config.route);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while logging in" },
      { status: 500 }
    );
  }
}
