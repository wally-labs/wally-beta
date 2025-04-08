"use client";

import { Heart, CircleArrowRight, StopCircle } from "lucide-react";
import { ChatMessage } from "~/app/_components/message/chat-message";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useChat, type Message } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import ShineBorder from "@components/ui/shine-border";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import UpdateProfile from "../profile/update-profile";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

interface Emotion {
  emotion: string;
  emoji: string;
}

export default function ChatHome() {
  const emotions: Emotion[] = [
    { emotion: "joyful", emoji: "😊" },
    { emotion: "sad", emoji: "😔" },
    { emotion: "angry", emoji: "😡" },
    { emotion: "fearful", emoji: "😨" },
    { emotion: "disgusted", emoji: "🤢" },
    { emotion: "surprised", emoji: "😲" },
    { emotion: "sarcastic", emoji: "😏" },
    { emotion: "flirty", emoji: "😘" },
    { emotion: "romantic", emoji: "🌹" },
    { emotion: "neutral", emoji: "😐" },
  ];

  // object has the same name as the slug in the URL
  const { chats } = useParams();
  const chatId = Array.isArray(chats) ? chats[0] : chats;

  // handles getting profile data from the db and setting it in the UI
  const {
    data: dataChat,
    isLoading: isLoadingChat,
    isSuccess: isSuccessChat,
  } = api.chat.getChat.useQuery(chatId ? { chatId: chatId } : skipToken, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!chatId,
  });

  const redHeartLevel = dataChat?.heartLevel;
  const relationship = dataChat?.relationship;
  const name = dataChat?.name;
  const grayHeartLevel = redHeartLevel ? 5 - redHeartLevel : 0;

  // handle openai api call
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [shouldSubmit, setShouldSubmit] = useState(false);

  // handle getting all previous messages from the db
  const { data: dataMessages } = api.messages.getChatMessages.useQuery(
    chatId ? { chatId: chatId } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!chatId,
    },
  );

  // useChat() hook sends a HTTP POST request to /api/chat endpoint
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
  } = useChat({
    api: "/api/chat",
    experimental_prepareRequestBody: ({ messages }) => ({
      messages,
      emotion: selectedEmotion,
      chatId: chatId,
      profileData: dataChat,
    }),
    onFinish: (assistantMessage, { usage, finishReason }) => {
      void (async () => {
        // for logging and debugging purposes, uncomment if unnecessary
        console.log("Finished streaming message:", assistantMessage);
        console.log("Token usage:", usage);
        console.log("Finish reason:", finishReason);

        // delay just to ensure the messages array is definitely updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (messages.length >= 2) {
          const lastUserMessage = messages[messages.length - 2];
          const lastAssistantMessage = messages[messages.length - 1];

          // first try saving last user message
          try {
            await saveMessageMutation.mutateAsync({
              chatId: chatId!,
              content: lastUserMessage!.content,
              messageBy: lastUserMessage!.role === "user" ? "USER" : "WALLY",
            });
            console.log("User message saved.");
          } catch (error) {
            console.error("Error saving user message:", error);
          }

          await new Promise((resolve) => setTimeout(resolve, 200));

          // then try saving last assistant message
          try {
            await saveMessageMutation.mutateAsync({
              chatId: chatId!,
              content: lastAssistantMessage!.content,
              messageBy:
                lastAssistantMessage!.role === "user" ? "USER" : "WALLY",
            });
            console.log("Assistant message saved.");
          } catch (error) {
            console.error("Error saving assistant message:", error);
          }
        }
      })();
    },
    onResponse: (response) => {
      console.log("Received HTTP response from server:", response);
      // Optionally handle early response, or abort processing if needed.
    },
    onError: (error) => {
      toast.error("An error occurred, ", {
        description: error.name,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        action: { label: "Retry", onClick: () => reload() },
      });
    },
  });

  // use setMessage to set queried messages into data to be sent to the openai api
  useEffect(() => {
    if (dataMessages) {
      const queriedMessages: Message[] = dataMessages.map((message) => ({
        id: message.id,
        content: message.content,
        role: message.messageBy === "USER" ? "user" : "assistant",
      }));
      setMessages(queriedMessages);
    }
  }, [dataMessages, setMessages]);

  // saveMessageMutation
  const saveMessageMutation = api.messages.saveMessage.useMutation({
    onSuccess: () => {
      console.log("Message saved to db successfully");
    },
    onError: (error) => {
      console.error("Error saving message: ", error);
    },
  });

  // handles selecting an emotion from the dropdown menu, once emotion is set in state, should submit the message
  // once message is ready to be submitted, save that message to the db
  const handleEmotionSubmit = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShouldSubmit(true);
  };

  // useEffect to handle submitting the message once shouldSubmit is set to true
  useEffect(() => {
    if (shouldSubmit) {
      handleSubmit();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, handleSubmit]);

  return (
    // DIVIDE into components once ui is decided -> components take in heart level as input and return ui accordingly
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
      <div className="flex h-[10%] w-[70%] items-center justify-between space-x-2">
        <div className="flex">
          {isLoadingChat &&
            Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} className="text-gray-500" />
            ))}
          {isSuccessChat &&
            Array.from({ length: redHeartLevel! }).map((_, i) => (
              <Heart key={i} className="text-red-500" />
            ))}
          {isSuccessChat &&
            Array.from({ length: grayHeartLevel }).map((_, i) => (
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
          <UpdateProfile />
        </div>
      </div>
      <ScrollArea className="mx-auto flex h-[500px] w-[70%] min-w-[70%] flex-col space-y-2 overflow-y-auto rounded-md border pb-2">
        {/* placeholder because the UI is not fixed yet */}
        <ChatMessage message="Hello! I'm Wally, your relationship wellness assistant. How can I help you today?" />
        {/* map each message in messages[] to a <ChatMessage> Component */}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.content}
            isUser={message.role === "user"}
          />
        ))}
        {status == "streaming" && <ChatMessage message="..." />}
      </ScrollArea>
      <div className="mx-auto w-[70%] min-w-[70%] p-4">
        <label htmlFor="newMessage" className="sr-only">
          Send a Message
        </label>
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <ShineBorder
            className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <textarea
              id="newMessage"
              className="w-full resize-none border-none bg-inherit p-4 focus:outline-none sm:text-sm"
              rows={1}
              placeholder="Send a Message to Wally"
              value={input}
              onChange={handleInputChange}
            ></textarea>
            <div className="flex items-center gap-2 p-4">
              {(status === "submitted" || status === "streaming") && (
                <Button onClick={stop} variant="main">
                  <StopCircle />
                </Button>
              )}
              {status === "ready" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="main">
                      <CircleArrowRight className="text-lg" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Emotions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {emotions.map((e) => {
                      return (
                        <DropdownMenuItem
                          key={e.emotion}
                          onClick={() => {
                            handleEmotionSubmit(e.emotion);
                          }}
                        >
                          {e.emotion}
                          <span>{e.emoji}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </ShineBorder>
        </div>
      </div>
    </div>
  );
}
