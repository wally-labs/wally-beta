// import Link from "next/link";
// import { LatestPost } from "~/app/_components/post";

import { SendMessage } from "~/components/send-message";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center gap-20 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
        <h1 className="text-5xl font-bold text-[#F7CA79]">
          Say Hello To Wally!
        </h1>
        <div className="w-[70%]">
          <SendMessage />
        </div>
      </div>
    </HydrateClient>
  );
}
