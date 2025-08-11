import mongoose, { Schema } from "mongoose";

const BirthCertificateSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      default: "Birth Certificate",
    },
    childName: String,
    dob: Date,
    placeOfBirth: String,
    parents: {
      father: String,
      mother: String,
      grandparents: [String],
    },
    hospitalDetails: {
      name: String,
      address: String,
      contactNumber: String,
    },
    parentIdentityProof: String,
    marriageCertificate: String,
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

const BirthCertificate =
  mongoose.models.BirthCertificate ||
  mongoose.model("BirthCertificate", BirthCertificateSchema);
export default BirthCertificate;
