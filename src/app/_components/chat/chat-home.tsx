"use client";

import { Heart, StopCircle } from "lucide-react";
import { ChatMessage } from "~/app/_components/message/chat-message";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
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
// import type { Attachment } from "ai";
import Image from "next/image";

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

type Attachment = {
  name?: string;
  contentType?: string;
  url: string;
};

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  experimental_attachments?: Attachment[];
};

export default function ChatHome() {
  // ref object to scroll to the bottom of the chat
  const scrollRef = useRef<HTMLDivElement>(null);

  // ref object to store the uploaded file, only until file is used for a message
  const wallyFileRef = useRef<Attachment | null>(null);

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

  // set state of the currently selected emotion (useState to display on frontend in future)
  const [selectedEmotion, setSelectedEmotion] = useState("");
  // handle openai api call
  const [shouldSubmit, setShouldSubmit] = useState(false);

  // saveMessageMutation
  const saveMessageMutation = api.messages.saveMessage.useMutation({
    onSuccess: () => {
      console.log("Message saved to db successfully");
    },
    onError: (error) => {
      console.error("Error saving message: ", error);
    },
  });

  // handle getting all previous messages from the db (useQuery())
  const { data: dataMessages } = api.messages.getChatMessages.useQuery(
    chatId ? { chatId: chatId } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!chatId,
    },
  );

  // store all previous messages in state
  const [messages, setMessages] = useState<Message[]>([]);

  // set all messages once fetched from the db
  useEffect(() => {
    if (dataMessages) {
      const queriedMessages = dataMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role:
          msg.messageBy === "USER" ? ("user" as const) : ("assistant" as const),
        experimental_attachments: msg.files.length
          ? (msg.files as Attachment[])
          : undefined,
      }));

      setMessages(queriedMessages.reverse());
    }
  }, [dataMessages]);

  // stream messages from server
  const [messageStreams, setMessageStreams] = useState([
    { id: 0, chunks: [] as string[] },
    { id: 1, chunks: [] as string[] },
    { id: 2, chunks: [] as string[] },
  ]);

  // flag that checks if the stream is finished
  const [streamDone, setStreamDone] = useState(false);

  // helper that turns fetch Response into parsed SSE “data” events
  async function startStreaming(res: Response) {
    if (!res.ok || !res.body) {
      console.error("Chat API error", await res.text());
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // accumulate text
      buffer += decoder.decode(value, { stream: true });

      // split into full SSE blocks (`\n\n` delimits events)
      const parts = buffer.split("\n\n");
      buffer = parts.pop()!; // last chunk may be incomplete—keep it for next round

      for (const part of parts) {
        // each `part` looks like:
        //   data: {"choices":[{...}]}
        const lines = part.split(/\r?\n/);
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const payload = line.slice(5).trim();
          if (payload === "[DONE]") {
            return; // stream finished
          }

          // parse the JSON chunk from OpenAI
          let msg;
          try {
            msg = JSON.parse(payload) as {
              choices: { delta: { content?: string }; index: number }[];
            };
          } catch (err) {
            console.error("SSE parse error", err, payload);
            continue;
          }

          // push each choice.delta.content into your streams state
          for (const choice of msg.choices) {
            const txt = choice.delta.content;
            if (!txt) continue;

            setMessageStreams((prev) =>
              prev.map((s) =>
                s.id === choice.index
                  ? { ...s, chunks: [...s.chunks, txt] }
                  : s,
              ),
            );
          }

          setStreamDone(true);
        }
      }
    }
  }

  const handleSubmit = async (userInput: string) => {
    if (!shouldSubmit) return;

    const file = wallyFileRef.current;

    // save user message to the db first
    void saveMessageMutation.mutate({
      chatId: chatId!,
      content: userInput,
      messageBy: "USER",
      files: file ? [file] : [],
    });

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          ...messages,
          {
            id: "random-for-now",
            content: userInput,
            role: "user",
            experimental_attachments: file ? [file] : undefined,
          },
        ],
        emotion: selectedEmotion,
        chatId: chatId,
        profileData: chatData,
      }),
    });

    await startStreaming(res);

    wallyFileRef.current = null;
    setShouldSubmit(false);
  };

  // handles selecting an emotion from the dropdown menu, once emotion is set in state, should submit the message
  // once message is ready to be submitted, save that message to the db
  const handleEmotionSubmit = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShouldSubmit(true);
  };

  // handles input changes in the textarea
  const [userInput, setUserInput] = useState("");

  // send userInput to /api/chat on shouldSubmit == true
  useEffect(() => {
    if (shouldSubmit) {
      const trimmed = userInput.trim();
      if (trimmed) {
        handleSubmit(trimmed);
        setUserInput("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSubmit]);

  // When streamDone flips, save each of the 3 assistant replies…
  useEffect(() => {
    if (!streamDone) return;

    console.log(messageStreams);

    // messageStreams.forEach((stream) => {
    //   const text = stream.chunks.join("");
    //   saveMessageMutation.mutate({
    //     chatId: chatId!,
    //     content: text,
    //     messageBy: "WALLY",
    //     files: [],
    //   });
    // });

    setStreamDone(false);
  }, [streamDone, messageStreams, saveMessageMutation, chatId]);

  // auto‑resize the textarea to fit content, see how this works with the UI
  // const textareaRef = useRef<HTMLTextAreaElement>(null);

  // useEffect(() => {
  //   const ta = textareaRef.current;
  //   if (!ta) return;
  //   ta.style.height = "auto";
  //   ta.style.height = ta.scrollHeight + "px";
  // }, [userInput]);

  // send userInput to /api/chat on Enter key press
  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     const trimmed = userInput.trim();
  //     if (trimmed) {
  //       handleSubmit(trimmed);
  //       setUserInput("");
  //     }
  //   }
  // };

  // scroll to the bottom of the chat when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollRef, messages]);

  return (
    // DIVIDE into components once ui is decided -> components take in heart level as input and return ui accordingly
    <div className="flex min-h-[80vh] min-w-[65vw] flex-col items-center justify-between gap-10 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
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
            {message.experimental_attachments
              ?.filter((att) => att.contentType?.startsWith("image/"))
              .map((att, ai) => (
                <Image
                  key={`${mi}-${ai}`}
                  src={att.url}
                  alt={att?.name ?? "image"}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              ))}
            <div
              key={mi}
              className="prose max-w-full"
              dangerouslySetInnerHTML={{
                __html: marked(message.content ?? ""),
              }}
            ></div>
            <div ref={scrollRef} />
          </ChatMessage>
        ))}
        {/* {status == "streaming" && <ChatMessage>...</ChatMessage>} */}
        {/* map each streamMessage to its own dropdown item component */}
        {messageStreams.map((stream) => {
          const fullText = stream.chunks.join("");
          return (
            <ChatMessage key={stream.id} isUser={false}>
              <div
                key={stream.id}
                className="prose max-w-full"
                dangerouslySetInnerHTML={{
                  __html: marked(fullText ?? ""),
                }}
              ></div>
            </ChatMessage>
          );
        })}
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
            console.log("File URL: ", res[0]?.ufsUrl);
            wallyFileRef.current = {
              name: res[0]?.name ?? "",
              url: res[0]?.ufsUrl ?? "",
              contentType: res[0]?.type ?? "",
            };
            console.log("Image file wally: ", wallyFileRef.current);
            console.log("Image url:", wallyFileRef.current?.url);
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
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
            <div className="flex items-center gap-2 p-4">
              <>
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
            </div>
          </ShineBorder>
        </div>
      </div>
    </div>
  );
}
