import CreateProfile from "~/app/_components/profile/create-profile";

export default async function CreateChat() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[white] to-[#f7faff] text-black">
      <CreateProfile />
    </div>
  );
}
