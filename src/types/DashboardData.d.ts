export interface DashboardData {
  totalApplications: number;
  revenueGenerated: number;
  approved: number;
  rejected: number;
  pending: number;
  recentApplications: {
    id: string;
    name: string;
    type: string;
    status: string;
    date: string;
  }[];
  data: {
    month: string;
    Affidavit: number;
    Domicile: number;
    Income: number;
    Birth: number;
    NonCreamyLayer: number;
  }[];
}
