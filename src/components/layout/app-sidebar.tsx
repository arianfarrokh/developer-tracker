"use client";

import Link from "next/link";
import {
  LayoutDashboardIcon,
  FolderKanbanIcon,
  CalendarIcon,
  TargetIcon,
  RepeatIcon,
  GraduationCapIcon,
  StickyNoteIcon,
  SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "داشبورد", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "پروژه‌ها", href: "/projects", icon: FolderKanbanIcon },
  { title: "تقویم", href: "/calendar", icon: CalendarIcon },
  { title: "اهداف", href: "/goals", icon: TargetIcon },
  { title: "عادت‌ها", href: "/habits", icon: RepeatIcon },
  { title: "یادگیری", href: "/learning", icon: GraduationCapIcon },
  { title: "یادداشت‌ها", href: "/notes", icon: StickyNoteIcon },
  { title: "تنظیمات", href: "/settings", icon: SettingsIcon },
] as const;

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutDashboardIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">Developer Tracker</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  داشبورد توسعه‌دهنده
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>منو</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 text-xs text-sidebar-foreground/60">
          Placeholder sidebar
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
