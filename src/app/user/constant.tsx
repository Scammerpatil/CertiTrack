import { SideNavItem } from "@/types/types";
import {
  IconLayoutDashboard,
  IconFileCertificate,
  IconHistory,
  IconSettings,
  IconBell,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "User Dashboard",
    path: "/user/dashboard",
    icon: <IconLayoutDashboard width="24" height="24" />,
  },
  {
    title: "Apply for Certificate",
    path: "/user/apply-certificate",
    icon: <IconFileCertificate width="24" height="24" />,
  },
  {
    title: "Application History",
    path: "/user/application-history",
    icon: <IconHistory width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/user/notifications",
    icon: <IconBell width="24" height="24" />,
  },
  {
    title: "Account Settings",
    path: "/user/settings",
    icon: <IconSettings width="24" height="24" />,
  },
];
