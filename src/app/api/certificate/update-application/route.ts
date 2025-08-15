import Affidavit from "@/models/Affidavit";
import BirthCertificate from "@/models/BirthCertificate";
import DomicileCertificate from "@/models/DomicileCertificate";
import IncomeCertificate from "@/models/IncomeCertificate";
import NonCreamyLayer from "@/models/NonCreamyLayer";
import Notification from "@/models/Notification";
import User from "@/models/User";
import mailSender from "@/middlewares/mailSender.config";
import fs from "fs";
import ejs from "ejs";
import { NextRequest, NextResponse } from "next/server";

const models: Record<string, any> = {
  Affidavit: Affidavit,
  "Birth Certificate": BirthCertificate,
  "Domicile Certificate": DomicileCertificate,
  "Non-Creamy Layer Certificate": NonCreamyLayer,
  "Income Certificate": IncomeCertificate,
};

export async function PATCH(req: NextRequest) {
  try {
    const { appId, remark, status, officer, applicationType } =
      await req.json();
    console.log(applicationType);
    if (!appId || !remark || !status || !officer) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    const Model = models[applicationType];
    if (!Model) {
      return NextResponse.json(
        { message: "Invalid application type" },
        { status: 400 }
      );
    }

    const application = await Model.findById(appId);
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    // Update status and remarks
    application.status = status;
    const remarksField = `remarkBy${officer}`;
    application[remarksField] = remark;
    await application.save();

    // Fetch the user
    const user = await User.findById(application.applicantId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const title = `${applicationType} Application ${status}`;
    const message = `Your ${applicationType.toLowerCase()} application has been ${status.toLowerCase()} by the ${officer}. Remark: ${remark}`;

    // Save notification
    const notification = new Notification({
      recipientModel: "User",
      recipient: user._id,
      type: "STATUS_UPDATED",
      title,
      message,
      relatedCertificateModel:
        applicationType === "Non-Creamy Layer Certificate"
          ? "NonCreamyLayer"
          : applicationType.split(" ").join(""),
      relatedCertificate: application._id,
      sendAt: new Date(),
    });
    await notification.save();
    const data = {
      userName: user.name,
      title,
      message,
      relatedCertificateModel: applicationType,
      relatedCertificateId: application._id,
      status,
      createdAt: new Date(),
    };
    await sendEmailNotification(data, user);

    return NextResponse.json(
      { message: "Application updated and user notified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { message: "Error updating application" },
      { status: 500 }
    );
  }
}

const sendEmailNotification = async (data: any, user: any) => {
  const template = fs.readFileSync(
    "./src/templates/certificateStatusEmail.ejs",
    "utf-8"
  );
  if (!template) {
    console.error("Email template not found");
    return;
  }
  const renderedTemplateData = {
    title: data.title,
    message: data.message,
    relatedCertificateModel: data.relatedCertificateModel,
    relatedCertificateId: data.relatedCertificateId,
    status: data.status,
    createdAt: data.createdAt,
    userName: user.name,
    certificateId: data.relatedCertificateId,
    date: new Date().toLocaleDateString(),
  };
  const html = ejs.render(template, { ...renderedTemplateData });
  const response = await mailSender(user.email, data.title, html);
  if (!response) {
    console.error("Failed to send email notification");
  }
};
