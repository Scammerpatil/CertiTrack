import mongoose, { Schema } from "mongoose";

const NonCreamyLayerSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    generalInfo: {
      fullName: String,
      dob: Date,
      address: String,
      district: String,
      taluka: String,
    },
    type: {
      type: String,
      default: "Non-Creamy Layer Certificate",
    },
    proofOfIdentity: {
      type: {
        type: String,
        enum: [
          "Passport",
          "Aadhaar",
          "Ration Card",
          "Voter ID",
          "Driving License",
          "Electricity Bill",
        ],
      },
      fileUrl: String,
    },
    proofOfAddress: {
      type: {
        type: String,
        enum: [
          "Passport",
          "Aadhaar",
          "Ration Card",
          "Voter ID",
          "Driving License",
          "Electricity Bill",
        ],
      },
      fileUrl: String,
    },
    incomeProof: {
      type: {
        type: String,
      },
      fileUrl: String,
    },
    casteProof: {
      type: {
        type: String,
      },
      fileUrl: String,
    },
    selfDeclaration: {
      type: {
        type: String,
      },
      fileUrl: String,
    },
    status: {
      type: String,
      enum: [
        "Pending at CO",
        "Verified by CO",
        "Approved by SDO",
        "Approved by DO",
        "Certificate Issued",
        "Rejected By CO",
        "Rejected By SDO",
        "Rejected By DO",
      ],
      default: "Pending at CO",
    },
    remarkByCO: String,
    remarkBySDO: String,
    remarkByDO: String,
  },
  { timestamps: true }
);

const NonCreamyLayer =
  mongoose.models.NonCreamyLayer ||
  mongoose.model("NonCreamyLayer", NonCreamyLayerSchema);
export default NonCreamyLayer;
