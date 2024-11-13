"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, Inbox } from "lucide-react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "",
    icon: Home,
  },
  {
    title: "Tracing",
    url: "tracing",
    icon: Inbox,
  },
];

export function NavLinks({ id }: { id: string }) {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  console.log(pathname);
  console.log(segments);

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.url == (segments?.[0] ?? "")}
          >
            <a href={`/facilities/${id}/${item.url}`}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
