import fs from "fs";
import ejs from "ejs";
import { NextRequest, NextResponse } from "next/server";
import CertificateOfficer from "@/models/CertificateOfficer";
import Notification from "@/models/Notification";
import User from "@/models/User";
import mailSender from "@/middlewares/mailSender.config";
import dbConfig from "@/middlewares/db.config";
import IncomeCertificate from "@/models/IncomeCertificate";

dbConfig();

export async function POST(req: NextRequest) {
  const { incomeCertificate } = await req.json();
  const user = await User.findById(incomeCertificate.applicantId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  try {
    if (incomeCertificate) {
      const newIncomeCertificate = new IncomeCertificate(incomeCertificate);
      const certificate = await newIncomeCertificate.save();

      // Make new Notification and send email
      const notification = new Notification({
        recipientModel: "User",
        recipient: incomeCertificate.applicantId,
        type: "CERTIFICATE_APPLIED",
        title: "Affidavit Applied",
        message: "Your affidavit application has been submitted.",
        relatedCertificateModel: "Affidavit",
        relatedCertificate: certificate._id,
        sendAt: new Date(),
      });
      await notification.save();
      // Send Notification to CO
      const certificateOfficer = await CertificateOfficer.findOne({
        taluka: incomeCertificate.generalInfo.taluka,
        district: incomeCertificate.generalInfo.district,
      });
      if (certificateOfficer) {
        const notificationToCO = new Notification({
          recipientModel: "CertificateOfficer",
          recipient: certificateOfficer._id,
          type: "CERTIFICATE_APPLIED",
          title: "New Income Certificate Application",
          message: `A new income certificate application has been submitted by ${incomeCertificate.applicantId}.`,
          relatedCertificateModel: "IncomeCertificate",
          relatedCertificate: certificate._id,
          sendAt: new Date(),
        });
        await notificationToCO.save();
      }
      sendEmailNotification(notification, user);
      return NextResponse.json(
        { message: "Affidavit applied successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "No affidavit data provided" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("This Error has Happened:", error);
    return NextResponse.json(
      { message: "Failed to apply for affidavit" },
      { status: 500 }
    );
  }
}

const sendEmailNotification = async (notification: any, user: any) => {
  const template = fs.readFileSync(
    "./src/templates/notificationEmail.ejs",
    "utf-8"
  );
  if (!template) {
    console.error("Email template not found");
    return;
  }
  const renderedTemplateData = {
    title: notification.title,
    message: notification.message,
    relatedCertificateModel: notification.relatedCertificateModel,
    relatedCertificateId: notification.relatedCertificate,
    status: "Pending",
    createdAt: notification.sendAt,
  };
  const html = ejs.render(template, { ...renderedTemplateData });
  const response = await mailSender(user.email, notification.title, html);
  if (!response) {
    console.error("Failed to send email notification");
  }
};
