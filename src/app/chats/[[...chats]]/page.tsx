"use client";

import { SendMessage } from "~/components/chats/send-message";
import { Heart } from "lucide-react";
import { ProfileDropdown } from "~/components/chats/profile-dropdown";
import { ChatMessage } from "../../_components/chat-message";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";

export default function ChatHome() {
  const { chats } = useParams();
  const chatHeader = Array.isArray(chats) ? chats[0] : chats;
  const { data, isLoading, isSuccess } = api.messages.getChatMessages.useQuery(
    chatHeader ? { chatId: chatHeader } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[white] to-[#f7faff] text-black">
      <div className="flex h-[10%] w-[70%] items-center justify-between space-x-2">
        <div className="flex">
          <Heart className="text-red-500" />
          <Heart className="text-red-500" />
          <Heart className="text-red-500" />
          <Heart className="text-red-500" />
          <Heart className="text-red-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-red-600">Samantha 🌹</h2>
          <h3 className="text-center text-xl font-semibold text-red-600">
            Fiance
          </h3>
        </div>
        <div>
          <ProfileDropdown />
        </div>
      </div>
      <div className="mx-auto flex w-[70%] flex-col space-y-2 overflow-y-auto pb-2">
        <ChatMessage message="Hello there!" isUser={true} />
        <ChatMessage message="Hey there! How’s it going? Working on anything interesting today?" />
        <ChatMessage
          message="I am doing pretty good! I need your help TextMate, I am currently talking to the love of my life and I think she's mad what do I say?"
          isUser={true}
        />
        <ChatMessage message="Sure, I’d be happy to help! Go ahead and send the screenshot, and I’ll do my best to guide you through it." />
      </div>
      <div className="mx-auto w-[70%] p-4">
        <SendMessage />
      </div>
    </div>
  );
}
