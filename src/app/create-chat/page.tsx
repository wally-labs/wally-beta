import { auth } from "@clerk/nextjs/server";
// import { currentUser } from "@clerk/nextjs/server";
import CreateProfile from "~/components/profile/create-profile";

export default async function CreateChat() {
  const session = await auth();
  // const user = await currentUser();

  if (session) {
    // console.log("User is signed in! ", user);
    console.log("User is signed in! CreateChat component", session.userId);
  } else {
    // console.log("User is NOT signed in!", user);
    console.log("User is NOT signed in! CreateChat component");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[white] to-[#f7faff] text-black">
      <CreateProfile />
    </div>
  );
}
