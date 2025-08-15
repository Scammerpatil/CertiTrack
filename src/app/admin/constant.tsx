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
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconUserShield width="24" height="24" />,
  },
  {
    title: "Manage District Officers",
    path: "/admin/manage-district-officers",
    icon: <IconBuildingBank width="24" height="24" />,
  },
  {
    title: "Manage Sub-District Officers",
    path: "/admin/manage-sub-district-officers",
    icon: <IconBuildingBank width="24" height="24" />,
  },
  {
    title: "Manage Certificate Officers",
    path: "/admin/manage-certificate-officers",
    icon: <IconBuildingBank width="24" height="24" />,
  },
  {
    title: "District Wise Analytics",
    path: "/admin/district-analytics",
    icon: <IconMap width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <IconSettings width="24" height="24" />,
  },
];
