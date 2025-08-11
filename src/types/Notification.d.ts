export interface Notification {
  recipientModel:
    | "User"
    | "Admin"
    | "SubDivisionalOfficer"
    | "DistrictOfficer"
    | "CertificateOfficer";
  recipient: string;
  type:
    | "CERTIFICATE_APPLIED"
    | "CERTIFICATE_APPROVED"
    | "CERTIFICATE_REJECTED"
    | "STATUS_UPDATED"
    | "GENERAL";
  title: string;
  message: string;
  relatedCertificateModel: string;
  relatedCertificate: string;
  sendAt: Date;
}
