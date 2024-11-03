import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar";

import {
  ChevronUp,
  CircleUserRound,
  LogOut,
  MessageCircle,
  Settings,
  UserCircle2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

const chats = [
  {
    title: "Chat #1",
    url: "#",
    icon: CircleUserRound,
  },
  {
    title: "Chat #2",
    url: "#",
    icon: CircleUserRound,
  },
  {
    title: "Chat #3",
    url: "#",
    icon: CircleUserRound,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarGroupAction title="New Chat">
              <MessageCircle />
              <span className="sr-only">Start a New Chat!</span>
            </SidebarGroupAction>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.title}>
                  <SidebarMenuButton asChild>
                    <a href={chat.url}>
                      <chat.icon />
                      <span>{chat.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings />
                  Settings
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <UserCircle2Icon />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
