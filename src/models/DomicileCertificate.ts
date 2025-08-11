import mongoose, { Schema } from "mongoose";

const DomicileCertificateSchema = new Schema(
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
      default: "Domicile Certificate",
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
    residencyProof: String,
    proofByTalathi: String,
    proofByGramPanchayat: String,
    mandatoryDocs: [
      {
        name: String,
        fileUrl: String,
      },
    ],
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

const DomicileCertificate =
  mongoose.models.DomicileCertificate ||
  mongoose.model("DomicileCertificate", DomicileCertificateSchema);
export default DomicileCertificate;
