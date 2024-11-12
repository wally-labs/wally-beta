// import Link from "next/link";
// import { LatestPost } from "~/app/_components/post";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { SendMessage } from "~/components/send-message";
import { Heart } from "lucide-react";
import { ProfileDropdown } from "~/components/profile-dropdown";
import { ChatMessage } from "../../_components/chat-message";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
        <div className="flex h-[10%] w-[70%] items-center justify-between space-x-2">
          <div className="flex">
            <Heart className="text-red-500" />
            <Heart className="text-red-500" />
            <Heart className="text-red-500" />
            <Heart className="text-red-500" />
            <Heart className="text-red-500" />
            {/* <FontAwesomeIcon icon={faHeart} color="red" className="p-0.5" />
            <FontAwesomeIcon icon={faHeart} color="red" className="p-0.5" />
            <FontAwesomeIcon icon={faHeart} color="red" className="p-0.5" />
            <FontAwesomeIcon icon={faHeart} color="red" className="p-0.5" />
            <FontAwesomeIcon icon={faHeart} className="p-0.5" /> */}
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
        <div className="mt-auto flex h-full w-[70%] flex-col justify-end space-y-2 overflow-y-auto pb-2">
          <ChatMessage message="Hello there!" isUser={true} />
          <ChatMessage message="Hey there! How’s it going? Working on anything interesting today?" />
          <ChatMessage
            message="I am doing pretty good! I need your help TextMate, I am currently talking to the love of my life and I think she's mad what do I say?"
            isUser={true}
          />
          <ChatMessage message="Sure, I’d be happy to help! Go ahead and send the screenshot, and I’ll do my best to guide you through it." />
        </div>
        <div className="w-[70%]">
          <SendMessage />
        </div>
      </main>
    </HydrateClient>
  );
}
