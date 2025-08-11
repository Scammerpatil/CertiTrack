import mongoose, { Schema } from "mongoose";

const AffidavitSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    generalInfo: {
      fullName: String,
      dob: Date,
      district: String,
      taluka: String,
      address: String,
    },
    type: {
      type: String,
      default: "Affidavit",
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
    selfDeclaration: {
      type: {
        type: String,
        enum: ["Self-Attested Affidavit", "Notarized Affidavit"],
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

const Affidavit =
  mongoose.models.Affidavit || mongoose.model("Affidavit", AffidavitSchema);
export default Affidavit;
