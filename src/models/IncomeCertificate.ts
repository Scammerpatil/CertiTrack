import mongoose, { Schema } from "mongoose";

const IncomeCertificateSchema = new Schema(
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
    reason: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "Income Certificate",
    },
    tMinus2Income: Number,
    tMinus1Income: Number,
    currentIncome: Number,
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
        enum: [
          "Income tax statement letter",
          "Circle Officer Verification report",
          "If Recieved Salary Provide Form no16",
          "Retirement/Salary holders Bank Certificate",
          "If applicant is owner of the land then 7/12 to yield 8-A Talathi report",
        ],
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

const IncomeCertificate =
  mongoose.models.IncomeCertificate ||
  mongoose.model("IncomeCertificate", IncomeCertificateSchema);
export default IncomeCertificate;
