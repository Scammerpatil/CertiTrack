import fs from "fs";
import ejs from "ejs";
import { NextRequest, NextResponse } from "next/server";
import CertificateOfficer from "@/models/CertificateOfficer";
import Notification from "@/models/Notification";
import User from "@/models/User";
import mailSender from "@/middlewares/mailSender.config";
import dbConfig from "@/middlewares/db.config";
import DomicileCertificate from "@/models/DomicileCertificate";

dbConfig();

export async function POST(req: NextRequest) {
  const { domicileCertificate } = await req.json();
  const user = await User.findById(domicileCertificate.applicantId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  try {
    if (domicileCertificate) {
      const newDomicileCertificate = new DomicileCertificate(
        domicileCertificate
      );
      const certificate = await newDomicileCertificate.save();

      // Make new Notification and send email
      const notification = new Notification({
        recipientModel: "User",
        recipient: domicileCertificate.applicantId,
        type: "CERTIFICATE_APPLIED",
        title: "Domicile Certificate Applied",
        message: "Your domicile certificate application has been submitted.",
        relatedCertificateModel: "DomicileCertificate",
        relatedCertificate: certificate._id,
        sendAt: new Date(),
      });
      await notification.save();
      // Send Notification to CO
      const certificateOfficer = await CertificateOfficer.findOne({
        taluka: domicileCertificate.generalInfo.taluka,
        district: domicileCertificate.generalInfo.district,
      });
      if (certificateOfficer) {
        const notificationToCO = new Notification({
          recipientModel: "CertificateOfficer",
          recipient: certificateOfficer._id,
          type: "CERTIFICATE_APPLIED",
          title: "New Domicile Certificate Application",
          message: `A new domicile certificate application has been submitted by ${domicileCertificate.applicantId}.`,
          relatedCertificateModel: "DomicileCertificate",
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
