import ChatHome from "~/app/_components/chat/chat-home";

export default function MainChat() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-20 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
      <ChatHome />;
    </div>
  );
}
