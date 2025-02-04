// import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import CreateProfile from "~/components/profile/create-profile";

export default async function CreateChat() {
  const user = await currentUser();

  if (user) {
    console.log("User is signed in! ", user);
  } else {
    console.log("User is NOT signed in!", user);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[white] to-[#f7faff] text-black">
      <CreateProfile />
    </div>
  );
}
