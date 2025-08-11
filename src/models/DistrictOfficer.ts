import mongoose, { Schema } from "mongoose";

const DistrictOfficerSchema = new Schema({
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
    unique: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "district-officer",
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

const DistrictOfficer =
  mongoose.models.DistrictOfficer ||
  mongoose.model("DistrictOfficer", DistrictOfficerSchema);
export default DistrictOfficer;
