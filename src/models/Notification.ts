import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  recipientModel: {
    type: String,
    required: true,
    enum: [
      "User",
      "Admin",
      "SubDivisionalOfficer",
      "DistrictOfficer",
      "CertificateOfficer",
    ],
  },
  recipient: {
    type: Schema.Types.ObjectId,
    refPath: "recipientModel",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "CERTIFICATE_APPLIED",
      "CERTIFICATE_APPROVED",
      "CERTIFICATE_REJECTED",
      "STATUS_UPDATED",
      "GENERAL",
    ],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedCertificateModel: {
    type: String,
    enum: [
      "Affidavit",
      "DomicileCertificate",
      "NonCreamyLayer",
      "IncomeCertificate",
      "BirthCertificate",
    ],
    required: true,
  },
  relatedCertificate: {
    type: Schema.Types.ObjectId,
    refPath: "relatedCertificateModel",
    required: true,
  },
  sendAt: {
    type: Date,
    required: true,
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
