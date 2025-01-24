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
  CircleUserRound,
  HomeIcon,
  MessageCircle,
  Plus,
  Settings,
} from "lucide-react";
import { api } from "~/trpc/react";

// const chats = [
//   {
//     title: "Samantha",
//     url: "/chats/user-one",
//     icon: CircleUserRound,
//   },
// ];

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { data } = api.user.getAllChatHeaders.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <Sidebar collapsible="icon">
      <div className="top-0 flex w-full items-center justify-between p-3">
        {children}
      </div>
      <SidebarHeader className="p-0"></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={"/"}>
                  <HomeIcon />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarGroupAction title="New Chat">
              <MessageCircle />
              <span className="sr-only">Start a New Chat!</span>
            </SidebarGroupAction>
            <SidebarMenu>
              {data?.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <a href={chat.id}>
                      <CircleUserRound />
                      <span>{chat.chatHeader}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="create-chat">
                    <Plus />
                    <span>New Chat</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <SidebarMenu>
          <SidebarMenuItem key={"user-profile"} className="mx-auto">
            <SidebarMenuButton asChild>
              <a href="#">
                <Settings />
                <span>Configure Profile</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
