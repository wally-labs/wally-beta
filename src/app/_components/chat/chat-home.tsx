"use client";

import { Heart } from "lucide-react";
import { ChatMessage } from "~/app/_components/message/chat-message";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import { ScrollArea } from "~/components/ui/scroll-area";
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
import { WallyOptions } from "../message/wally-options";

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
  id?: string;
  content: string;
  role: "user" | "assistant";
  experimental_attachments?: Attachment[];
};
const PROFILE_COLORS = ["black", "gold", "orange", "violet", "red"];
const PROFILE_EMOJIS = ["🧊", "👋", "🤝", "🌹", "❤️"];

export default function ChatHome() {
  // ref object to scroll to the bottom of the chat
  const scrollRef = useRef<HTMLDivElement>(null);

  // ref object to store the uploaded file, only until file is used for a message
  const wallyFileRef = useRef<Attachment | null>(null);

  // handles input changes in the textarea
  const [userInput, setUserInput] = useState("");

  // set state of the currently selected emotion (useState to display on frontend in future)
  const [selectedEmotion, setSelectedEmotion] = useState("");

  // handle openai api call
  const [shouldSubmit, setShouldSubmit] = useState(false);

  // store all previous messages in state
  const [messages, setMessages] = useState<Message[]>([]);

  // stream messages from server
  const [messageStreams, setMessageStreams] = useState([
    { id: 0, chunks: [] as string[] },
    { id: 1, chunks: [] as string[] },
    { id: 2, chunks: [] as string[] },
  ]);

  // textarea ref to auto‑resize the textarea to fit content
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_LINES = 5;

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
  const profileColor = PROFILE_COLORS[redHeartLevel - 1];
  const profileEmoji = PROFILE_EMOJIS[redHeartLevel - 1];

  // saveMessageMutation
  const saveMessageMutation = api.messages.saveMessage.useMutation({
    onSuccess: () => {
      console.log("Message saved to db successfully");
    },
    onError: (error) => {
      console.error("Error saving message: ", error);
    },
  });

  // saveWallyMessagesMutation
  const saveWallyMessagesMutation = api.messages.saveWallyMessages.useMutation({
    onSuccess: () => {
      console.log("Wally messages saved to db successfully");
    },
    onError: (error) => {
      console.error("Error saving Wally messages: ", error);
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

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (!msg.choices) {
            console.warn("No choices in payload: ", msg);
            continue;
          }

          const choices = Array.isArray(msg.choices)
            ? msg.choices
            : [msg.choices];

          // push each choice.delta.content into your streams state
          for (const choice of choices) {
            const txt = choice.delta?.content;
            if (!txt) continue;

            setMessageStreams((prev) =>
              prev.map((s) =>
                s.id === choice.index
                  ? { ...s, chunks: [...s.chunks, txt] }
                  : s,
              ),
            );
          }
        }
      }
    }
  }

  // handle submitting the message to the server
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

    // set user message into messages state (UI)
    setMessages((prev) => [
      ...prev,
      {
        content: userInput,
        role: "user",
        experimental_attachments: file ? [file] : [],
      } as Message,
    ]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          ...messages,
          {
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

  // send userInput to /api/chat on shouldSubmit == true
  useEffect(() => {
    if (shouldSubmit) {
      const trimmed = userInput.trim();
      if (trimmed) {
        void handleSubmit(trimmed);
        setUserInput("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSubmit]);

  // send selected message + all other messages to db
  const onSubmitWallyMessage = (messageId: number) => {
    // remove toast (in production)
    toast.success(`Message ${messageId + 1} saved successfully!`);

    const selectedMessage = messageStreams.find((m) => m.id === messageId);
    if (!selectedMessage) return;

    const selectedMessageContent = selectedMessage.chunks.join("");

    // call saveWallyMessages mutation
    void saveWallyMessagesMutation.mutate({
      chatId: chatId!,
      selectedMessage: {
        content: selectedMessageContent,
        messageBy: "WALLY",
      },
      messages: messageStreams.map((m) => {
        return {
          content: m.chunks.join(""),
          messageBy: "WALLY",
        };
      }),
    });

    // reset message streams
    setMessageStreams([
      { id: 0, chunks: [] as string[] },
      { id: 1, chunks: [] as string[] },
      { id: 2, chunks: [] as string[] },
    ]);

    // set messages state with selected message
    setMessages((prev) => [
      ...prev,
      {
        content: selectedMessageContent,
        role: "assistant",
      },
    ]);
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";

    // compute current line height and max allowable height
    const lineHeight = parseFloat(getComputedStyle(ta).lineHeight || "0");
    const maxHeight = lineHeight * MAX_LINES;

    // clamp new height to min[scrollHeight, maxHeight]
    const newHeight = Math.min(ta.scrollHeight, maxHeight);
    ta.style.height = `${newHeight}px`;
  }, [userInput]);

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
            <Heart key={i} style={{ color: profileColor }} />
          ))}
          {Array.from({ length: grayHeartLevel }).map((_, i) => (
            <Heart key={i} className="text-gray-500" />
          ))}
        </div>
        <div>
          <h2 className="text-3xl font-bold" style={{ color: profileColor }}>
            {name} {profileEmoji}
          </h2>
          <h3
            className="text-center text-xl font-semibold"
            style={{ color: profileColor }}
          >
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
              className="max-w-full whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: marked(message.content ?? ""),
              }}
            ></div>
          </ChatMessage>
        ))}
        {/* map each streamMessage to its own dropdown item component */}
        {messageStreams[0] && messageStreams[0].chunks.length > 0 && (
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500">
              Choose your favourite response from the options below!
            </span>
          </div>
        )}
        {messageStreams
          .map((stream) =>
            stream.chunks.length > 0
              ? { id: stream.id, content: stream.chunks.join("") }
              : null,
          )
          .map((stream) => {
            if (!stream?.content) return null;
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => onSubmitWallyMessage(stream.id)}
                className="w-full text-left"
              >
                <WallyOptions key={stream.id}>
                  <div
                    key={stream.id}
                    className="max-w-full"
                    dangerouslySetInnerHTML={{
                      __html: marked(stream.content),
                    }}
                  ></div>
                </WallyOptions>
              </button>
            );
          })}
        <div ref={scrollRef} />
      </ScrollArea>
      <div className="mx-auto flex w-[65vw] flex-col gap-0">
        <UploadDropzone
          className="relative m-0 max-h-[30px] w-full overflow-visible rounded-b-none border-b-0 bg-gray-100/50 p-0 ut-allowed-content:hidden ut-label:text-amberTheme ut-uploading:ut-label:text-amberTheme-darker"
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
              className="w-full resize-none border-none bg-inherit px-4 focus:outline-none sm:text-sm"
              placeholder="Send a Message to Wally"
              rows={1}
              value={userInput}
              ref={textareaRef}
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
            <div className="flex items-center gap-2">
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
