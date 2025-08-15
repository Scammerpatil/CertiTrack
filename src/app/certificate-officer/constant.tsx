import { SideNavItem } from "@/types/types";
import {
  IconDashboard,
  IconListDetails,
  IconBell,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/certificate-officer/dashboard",
    icon: <IconDashboard width="24" height="24" />,
  },
  {
    title: "Applications",
    path: "/certificate-officer/applications",
    icon: <IconListDetails width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/certificate-officer/notifications",
    icon: <IconBell width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/certificate-officer/settings",
    icon: <IconSettings width="24" height="24" />,
  },
];
