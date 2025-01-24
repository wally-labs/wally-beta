// import { auth } from "@clerk/nextjs/server";
import CreateProfile from "~/components/profile/create-profile";
import { auth } from "~/server/auth";

export default async function CreateChat() {
  const session = await auth();

  if (session?.user) {
    console.log("User is signed in! ", session?.user.id);
  } else {
    console.log("User is NOT signed in!", session);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[white] to-[#f7faff] text-black">
      <CreateProfile />
    </div>
  );
}
