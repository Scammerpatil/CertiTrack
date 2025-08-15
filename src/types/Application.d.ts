import { User } from "./user";

export interface Application {
  _id: string;
  applicantId: User;
  status: string;
  type: string;
  createdAt: Date;
  generalInfo: {
    fullName: string;
    dob: Date;
    district: string;
    taluka: string;
    address: string;
  };
  remarkByCO: string;
  remarkBySDO: string;
  remarkByDO: string;
}
