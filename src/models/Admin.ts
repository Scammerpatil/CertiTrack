import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({
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
  state: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "admin",
  },
  password: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;
