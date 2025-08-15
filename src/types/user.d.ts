import mongoose from "mongoose";

export interface User {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  taluka: string;
  district: string;
  profileImage: string;
  role: string;
}
