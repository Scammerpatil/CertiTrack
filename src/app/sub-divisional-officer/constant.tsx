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
    path: "/sub-divisional-officer/dashboard",
    icon: <IconLayoutDashboard width="24" height="24" />,
  },
  {
    title: "Manage Applications",
    path: "/sub-divisional-officer/manage-applications",
    icon: <IconCertificate width="24" height="24" />,
  },
  {
    title: "Manage Circle Officers",
    path: "/sub-divisional-officer/manage-circle-officers",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/sub-divisional-officer/settings",
    icon: <IconSettings width="24" height="24" />,
  },
];
