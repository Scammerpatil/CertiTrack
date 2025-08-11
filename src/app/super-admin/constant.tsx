import { SideNavItem } from "@/types/types";
import {
  IconUserShield,
  IconBuildingBank,
  IconUsers,
  IconMap,
  IconChecklist,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Super Admin Dashboard",
    path: "/super-admin/dashboard",
    icon: <IconUserShield width="24" height="24" />,
  },
  {
    title: "Manage Admins",
    path: "/super-admin/manage-admins",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "Manage District Officers",
    path: "/super-admin/manage-district-officers",
    icon: <IconBuildingBank width="24" height="24" />,
  },
  {
    title: "Manage Sub-District Officers",
    path: "/super-admin/manage-sub-district-officers",
    icon: <IconBuildingBank width="24" height="24" />,
  },
  {
    title: "Manage Certificate Officers",
    path: "/super-admin/manage-certificate-officers",
    icon: <IconBuildingBank width="24" height="24" />,
  },
  {
    title: "Monitor Applications",
    path: "/super-admin/monitor-applications",
    icon: <IconChecklist width="24" height="24" />,
  },
  {
    title: "State-wide Analytics",
    path: "/super-admin/state-analytics",
    icon: <IconMap width="24" height="24" />,
  },
  {
    title: "System Settings",
    path: "/super-admin/settings",
    icon: <IconSettings width="24" height="24" />,
  },
];
