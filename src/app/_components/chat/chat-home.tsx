"use client";

import { Heart, CircleArrowRight, StopCircle, Upload } from "lucide-react";
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
import { Button } from "@components/ui/button";
import { toast } from "sonner";

import UpdateProfile from "../profile/update-profile";
import { useAtomValue } from "jotai";
import { useCurrentChatData } from "../atoms";
import { marked } from "marked";
import { UploadDropzone } from "~/lib/uploadthing";
import { OurFileRouter } from "~/app/api/uploadthing/core";

interface Emotion {
  emotion: string;
  emoji: string;
}

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

export default function ChatHome() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  // object has the same name as the slug in the URL
  const { chats } = useParams();
  const chatId = Array.isArray(chats) ? chats[0] : chats;

  // get profile data from focusedChatDatAatom earlier and set UI
  const focusedChatData = useCurrentChatData(chatId!);
  const focusedChat = useAtomValue(focusedChatData);
  const chatData = focusedChat?.chatData;

  const redHeartLevel = chatData?.heartLevel;
  const relationship = chatData?.relationship;
  const name = chatData?.name;
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
      // profileData: dataChat,
      profileData: chatData,
    }),
    onFinish: (assistantMessage, { usage, finishReason }) => {
      // for logging and debugging purposes
      // console.log("Finished streaming message:", assistantMessage);
      console.log("Token usage:", usage);
      console.log("Finish reason:", finishReason);

      // try saving assistant message to db
      try {
        void saveMessageMutation.mutate({
          chatId: chatId!,
          content: assistantMessage.content,
          messageBy: "WALLY",
        });

        console.log("Finished saving assistant message: ", assistantMessage);
      } catch (error) {
        console.error("Error saving assistant message:", error);
      }
    },
    onResponse: (response) => {
      console.log("Received HTTP response from server:", response);
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
    if (shouldSubmit && chatId && input) {
      // try saving user message to db before calling handleSubmit()
      const userMessage = input;
      void saveMessageMutation.mutate({
        chatId: chatId,
        content: userMessage,
        messageBy: "USER",
      });

      console.log("Finished saving user message: ", userMessage);

      handleSubmit();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, handleSubmit, chatId, input, saveMessageMutation]);

  return (
    // DIVIDE into components once ui is decided -> components take in heart level as input and return ui accordingly
    <div className="flex min-h-[80vh] min-w-[65vw] flex-col items-center justify-center gap-10 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
      <div className="flex h-[10%] w-[80%] items-center justify-between space-x-2">
        <div className="flex">
          {Array.from({ length: redHeartLevel }).map((_, i) => (
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
          <UpdateProfile />
        </div>
      </div>
      <ScrollArea className="mx-auto flex h-[500px] w-[65vw] min-w-[65vw] flex-col space-y-2 overflow-y-auto rounded-md border">
        {/* map each message in messages[] to a <ChatMessage> Component */}
        {messages.map((message, mi) => (
          <ChatMessage key={mi} isUser={message.role === "user"}>
            {message.parts.map((part, pi) => {
              switch (part.type) {
                case "text":
                  return (
                    <div
                      key={pi}
                      className="prose max-w-full"
                      dangerouslySetInnerHTML={{
                        __html: marked(part.text ?? ""),
                      }}
                    />
                  );
                case "source":
                  return (
                    <a key={pi} href={part.source.url}>
                      {part.source.url}
                    </a>
                  );
                case "reasoning":
                  return <div key={pi}>{part.reasoning}</div>;
                case "tool-invocation":
                  return <div key={pi}>{part.toolInvocation.toolName}</div>;
                case "file":
                  return <div key={pi}>{part.data}</div>;
                case "step-start":
                  return null;
                default:
                  return null;
              }
            })}
          </ChatMessage>
        ))}
        {/* {status == "streaming" && <ChatMessage>...</ChatMessage>} */}
      </ScrollArea>
      <div className="mx-auto flex w-[65vw] flex-col gap-0">
        <UploadDropzone
          className="ut-allowed-content:hidden ut-label:text-amberTheme ut-uploading:ut-label:text-amberTheme-darker relative m-0 max-h-[30px] w-full overflow-visible rounded-b-none border-b-0 bg-gray-100/50 p-0"
          endpoint="imageUploader"
          config={{
            mode: "auto",
          }}
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("File: ", res);
            setImageUrl(res[0]?.ufsUrl);
            toast.success("Image uploaded successfully");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error
            console.log("Error uploading image: ", error);
            toast.error("Error uploading image");
          }}
        />
        <label htmlFor="newMessage" className="sr-only">
          Send a Message
        </label>
        <div className="flex items-center overflow-hidden rounded-b-lg rounded-t-none border border-t-0 border-gray-200 shadow-sm">
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
                <>
                  {/* <UploadButton
                    className="ut-button:bg-amberTheme ut-button:ut-readying:bg-amberTheme/50 ut-button:ut-uploading:bg-amberTheme/50"
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      toast.success("Image uploaded successfully");
                    }}
                    onUploadError={(error: Error) => {
                      console.log("Error uploading image: ", error);
                      toast.error("Error uploading image");
                    }}
                  /> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="main" className="text-md h-11">
                        Send
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
                </>
              )}
            </div>
          </ShineBorder>
        </div>
      </div>
    </div>
  );
}
