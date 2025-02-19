"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

export default function UpdateProfile() {
  const { chats } = useParams();
  const chatId = Array.isArray(chats) ? chats[0] : chats;

  const { data, isLoading, isSuccess } = api.chat.getChat.useQuery(
    chatId ? { chatId: chatId } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!chatId,
    },
  );

  return (
    <Popover>
      <PopoverTrigger asChild>Edit Profile</PopoverTrigger>
      <PopoverContent>this is a test!</PopoverContent>
    </Popover>
  );
}
