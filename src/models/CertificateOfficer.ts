import mongoose, { Schema } from "mongoose";

const CertificateOfficerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  taluka: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "certificate-officer",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
});

const CertificateOfficer =
  mongoose.models.CertificateOfficer ||
  mongoose.model("CertificateOfficer", CertificateOfficerSchema);
export default CertificateOfficer;
