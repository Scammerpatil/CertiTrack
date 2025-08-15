export interface Affidavit {
  applicantId: string;
  generalInfo: {
    fullName: string;
    dob: Date;
    address: string;
    district: string;
    taluka: string;
  };
  proofOfIdentity: {
    type: string;
    fileUrl: string;
  };
  proofOfAddress: {
    type: string;
    fileUrl: string;
  };
  mandatoryDocuments: {
    type: string;
    fileUrl: string;
  }[];
  status: string;
  remarkByCO: string;
  remarkBySDO: string;
  remarkByDO: string;
}
