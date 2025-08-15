import fs from "fs";
import ejs from "ejs";
import { NextRequest, NextResponse } from "next/server";
import Affidavit from "@/models/Affidavit";
import CertificateOfficer from "@/models/CertificateOfficer";
import Notification from "@/models/Notification";
import User from "@/models/User";
import mailSender from "@/middlewares/mailSender.config";
import dbConfig from "@/middlewares/db.config";
import BirthCertificate from "@/models/BirthCertificate";

dbConfig();

export async function POST(req: NextRequest) {
  const { birthCertificate } = await req.json();
  const user = await User.findById(birthCertificate.applicantId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  try {
    if (birthCertificate) {
      const newBirthCertificate = new BirthCertificate(birthCertificate);
      const certificate = await newBirthCertificate.save();

      // Make new Notification and send email
      const notification = new Notification({
        recipientModel: "User",
        recipient: birthCertificate.applicantId,
        type: "CERTIFICATE_APPLIED",
        title: "Birth Certificate Applied",
        message: "Your birth certificate application has been submitted.",
        relatedCertificateModel: "BirthCertificate",
        relatedCertificate: certificate._id,
        sendAt: new Date(),
      });
      await notification.save();
      // Send Notification to CO
      const certificateOfficer = await CertificateOfficer.findOne({
        taluka: birthCertificate.generalInfo.taluka,
        district: birthCertificate.generalInfo.district,
      });
      if (certificateOfficer) {
        const notificationToCO = new Notification({
          recipientModel: "CertificateOfficer",
          recipient: certificateOfficer._id,
          type: "CERTIFICATE_APPLIED",
          title: "New Birth Certificate Application",
          message: `A new birth certificate application has been submitted by ${birthCertificate.applicantId}.`,
          relatedCertificateModel: "BirthCertificate",
          relatedCertificate: certificate._id,
          sendAt: new Date(),
        });
        await notificationToCO.save();
      }
      sendEmailNotification(notification, user);
      return NextResponse.json(
        { message: "Birth certificate applied successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "No birth certificate data provided" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("This Error has Happened:", error);
    return NextResponse.json(
      { message: "Failed to apply for birth certificate" },
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
