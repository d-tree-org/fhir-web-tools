import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NavLinks } from "./nav-link";

export function AppSidebar({ id }: { id: string }) {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="pt-0 md:pt-14"></div>
        <SidebarGroup>
          <SidebarGroupLabel>Facility</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavLinks id={id} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
