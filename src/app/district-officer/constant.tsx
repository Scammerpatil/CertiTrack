import { SideNavItem } from "@/types/types";
import {
  IconLayoutDashboard,
  IconCertificate,
  IconChecklist,
  IconUsers,
  IconMap,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/district-officer/dashboard",
    icon: <IconLayoutDashboard width="24" height="24" />,
  },
  {
    title: "View Applications",
    path: "/district-officer/view-applications",
    icon: <IconChecklist width="24" height="24" />,
  },
  {
    title: "Manage Sub-Divisional Officers",
    path: "/district-officer/manage-sub-divisional-officers",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/district-officer/settings",
    icon: <IconSettings width="24" height="24" />,
  },
];
