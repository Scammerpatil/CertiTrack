import fs from "fs";
import ejs from "ejs";
import { NextRequest, NextResponse } from "next/server";
import Affidavit from "@/models/Affidavit";
import CertificateOfficer from "@/models/CertificateOfficer";
import Notification from "@/models/Notification";
import User from "@/models/User";
import mailSender from "@/middlewares/mailSender.config";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const { affidavit } = await req.json();
  const user = await User.findById(affidavit.applicantId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  try {
    if (affidavit) {
      const newAffidavit = new Affidavit(affidavit);
      const certificate = await newAffidavit.save();

      // Make new Notification and send email
      const notification = new Notification({
        recipientModel: "User",
        recipient: affidavit.applicantId,
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
        taluka: affidavit.generalInfo.taluka,
        district: affidavit.generalInfo.district,
      });
      if (certificateOfficer) {
        const notificationToCO = new Notification({
          recipientModel: "CertificateOfficer",
          recipient: certificateOfficer._id,
          type: "CERTIFICATE_APPLIED",
          title: "New Affidavit Application",
          message: `A new affidavit application has been submitted by ${affidavit.applicantId}.`,
          relatedCertificateModel: "Affidavit",
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
