export interface DistrictOfficer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  district: string; // Unique identifier for the district
  role: string; // Should be "district-officer"
  password?: string; // Optional for responses
  isApproved?: boolean; // Optional for responses, indicates if the officer is approved
}
