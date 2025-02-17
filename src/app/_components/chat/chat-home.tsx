"use client";

import { Heart } from "lucide-react";
import { SendMessage } from "~/app/_components/chat/send-message";
import { ProfileDropdown } from "~/app/_components/chat/profile-dropdown";
import { ChatMessage } from "~/app/_components/message/chat-message";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function ChatHome() {
  const { chats } = useParams();
  const chatHeader = Array.isArray(chats) ? chats[0] : chats;
  const {
    data: dataMessages,
    isLoading: isLoadingMessages,
    isSuccess: isSuccessMessages,
  } = api.messages.getChatMessages.useQuery(
    chatHeader ? { chatId: chatHeader } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!chatHeader,
    },
  );

  const {
    data: dataChat,
    isLoading: isLoadingChat,
    isSuccess: isLoadingSuccess,
  } = api.chat.getChat.useQuery(
    chatHeader ? { chatId: chatHeader } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!chatHeader,
    },
  );

  const redHeartLevel = dataChat?.heartLevel;
  const relationship = dataChat?.relationship;
  const name = dataChat?.name;
  const grayHeartLevel = redHeartLevel ? 5 - redHeartLevel : 0;
  console.log(redHeartLevel, grayHeartLevel);

  return (
    // DIVIDE into components once ui is decided -> components take in heart level as input and return ui accordingly
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
      <div className="flex h-[10%] w-[70%] items-center justify-between space-x-2">
        <div className="flex">
          {Array.from({ length: redHeartLevel! }).map((_, i) => (
            <Heart key={i} className="text-red-500" />
          ))}
          {Array.from({ length: grayHeartLevel }).map((_, i) => (
            <Heart key={i} className="text-gray-500" />
          ))}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-red-600">{name} 🌹</h2>
          <h3 className="text-center text-xl font-semibold text-red-600">
            {relationship}
          </h3>
        </div>
        <div>
          <ProfileDropdown />
        </div>
      </div>
      <ScrollArea className="mx-auto flex h-[500px] w-[70%] flex-col space-y-2 overflow-y-auto rounded-md border pb-2">
        {/* map each message in messages[] to a <ChatMessage> component */}
        <ChatMessage message="Hello there!" isUser={true} />
        <ChatMessage message="Hey there! How’s it going? Working on anything interesting today?" />
        <ChatMessage
          message="I am doing pretty good! I need your help TextMate, I am currently talking to the love of my life and I think she's mad what do I say?"
          isUser={true}
        />
        <ChatMessage message="Sure, I’d be happy to help! Go ahead and send the screenshot, and I’ll do my best to guide you through it." />
        <ChatMessage message="blah blah blah" isUser={true} />
        <ChatMessage message="Sure, I’d be happy to help! Go ahead and send the screenshot, and I’ll do my best to guide you through it." />
        <ChatMessage message="blah blah blah" isUser={true} />
      </ScrollArea>
      <div className="mx-auto w-[70%] p-4">
        <SendMessage />
      </div>
    </div>
  );
}
