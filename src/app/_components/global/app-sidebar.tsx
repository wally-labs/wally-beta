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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@components/ui/sidebar";

import {
  CircleFadingArrowUp,
  CircleUserRound,
  HomeIcon,
  MessageCircle,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

import { api } from "~/trpc/react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const state = useAuth();

  const { data, isLoading, isSuccess } = api.chat.getAllChatHeaders.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const deleteChatMutation = api.chat.deleteChat.useMutation({
    onSuccess: (data) => {
      console.log("Chat deleted successfully", data);
    },
    onError: (error) => {
      console.error("Failed to delete chat: ", error);
    },
  });

  function deleteChat(chatId: string) {
    deleteChatMutation.mutate({ chatId });
  }

  return (
    <Sidebar>
      <div className="top-0 flex w-full items-center justify-between p-3">
        {children}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={"/"}>
                  <HomeIcon />
                  <span>Home</span>
                </Link>
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
              {isLoading && (
                <SidebarMenuItem key={"loading"}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              )}
              {isSuccess &&
                data.length > 0 &&
                data.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/chats/${chat.id}`}>
                        <CircleUserRound />
                        <span>{chat.chatHeader}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
                          <span>Edit Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span onClick={() => deleteChat(chat.id)}>
                            Delete Profile
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={state.isSignedIn ? "/create-chat" : "/plans"}>
                    <Plus />
                    <span>New Chat</span>
                  </Link>
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
              <Link href="#">
                <CircleFadingArrowUp />
                <span>Upgrade plan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
