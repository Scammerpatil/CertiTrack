export interface Admin {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  state: string;
  role: string;
  password?: string; // Optional for responses
  isApproved?: boolean; // Optional for responses
}
