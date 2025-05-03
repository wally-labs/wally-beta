"use client";

interface ChatMessageProps {
  children: React.ReactNode;
}

export const WallyOptions: React.FC<ChatMessageProps> = ({ children }) => {
  return (
    <div className={"flex flex-row items-start space-x-3 p-4"}>
      {/* {!isUser && <UserCircle2 className="h-8 min-h-8 w-8 min-w-8" />} */}
      <div
        className={
          "max-w-auto rounded-lg bg-[#fafafa] p-3 text-gray-600 shadow-sm hover:shadow-md"
        }
      >
        {children}
      </div>
    </div>
  );
};
