import mongoose, { Schema } from "mongoose";

const SubDivisionalOfficerSchema = new Schema({
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
    default: "sub-divisional-officer",
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

const SubDivisionalOfficer =
  mongoose.models.SubDivisionalOfficer ||
  mongoose.model("SubDivisionalOfficer", SubDivisionalOfficerSchema);
export default SubDivisionalOfficer;
