import mongoose, { Schema } from "mongoose";

const BirthCertificateSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    generalInfo: {
      fullName: String,
      district: String,
      taluka: String,
    },
    type: {
      type: String,
      default: "Birth Certificate",
    },
    childName: String,
    dob: Date,
    placeOfBirth: String,
    gender: String,
    address: String,
    permanentAddress: String,
    parents: {
      father: String,
      mother: String,
    },
    hospitalDetails: {
      name: String,
      address: String,
      contactNumber: String,
    },
    parentIdentityProof: {
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
    marriageCertificate: {
      type: {
        type: String,
        enum: [
          "Marriage Certificate",
          "Court Marriage Certificate",
          "Religious Marriage Certificate",
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

const BirthCertificate =
  mongoose.models.BirthCertificate ||
  mongoose.model("BirthCertificate", BirthCertificateSchema);
export default BirthCertificate;
