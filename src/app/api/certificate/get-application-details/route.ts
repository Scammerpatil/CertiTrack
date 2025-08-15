import Affidavit from "@/models/Affidavit";
import BirthCertificate from "@/models/BirthCertificate";
import DomicileCertificate from "@/models/DomicileCertificate";
import IncomeCertificate from "@/models/IncomeCertificate";
import NonCreamyLayer from "@/models/NonCreamyLayer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  if (!id || !type) {
    return NextResponse.json(
      { message: "No application ID or type provided" },
      { status: 400 }
    );
  }
  try {
    const application = await getApplicationDetails(id, type);
    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error("Error fetching application details:", error);
    return NextResponse.json(
      { message: "Error fetching application details" },
      { status: 500 }
    );
  }
}

const getApplicationDetails = async (id: string, type: string) => {
  var application = null;
  switch (type) {
    case "Affidavit":
      application = await Affidavit.findById(id);
      break;
    case "Birth Certificate":
      application = await BirthCertificate.findById(id);
      break;
    case "Income Certificate":
      application = await IncomeCertificate.findById(id);
      break;
    case "Domicile Certificate":
      application = await DomicileCertificate.findById(id);
      break;
    case "Non-Creamy Layer Certificate":
      application = await NonCreamyLayer.findById(id);
      break;
    default:
      throw new Error("Invalid application type");
  }
  return application;
};
