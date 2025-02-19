import { CircleArrowRight } from "lucide-react";
import ShineBorder from "@components/ui/shine-border";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";

interface Emotion {
  emotion: string;
  emoji: string;
}

interface SendMessageProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onEmotionSubmit: (emotion: string) => void;
}

export function SendMessage({
  input,
  handleInputChange,
  onSubmit,
  onEmotionSubmit,
}: SendMessageProps) {
  const emotions: Emotion[] = [
    { emotion: "Happy", emoji: "😊" },
    { emotion: "Sad", emoji: "😔" },
    { emotion: "Angry", emoji: "😡" },
    { emotion: "Romantic", emoji: "🌹" },
  ];

  return (
    <div>
      <label htmlFor="newMessage" className="sr-only">
        Send a Message
      </label>
      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <ShineBorder
          className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <textarea
            id="newMessage"
            className="w-full resize-none border-none bg-inherit p-4 focus:outline-none sm:text-sm"
            rows={1}
            placeholder="Send a Message to Wally"
            value={input}
            onChange={handleInputChange}
          ></textarea>
          <div className="flex items-center gap-2 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CircleArrowRight className="text-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Emotions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {emotions.map((e) => {
                  return (
                    <DropdownMenuItem
                      key={e.emotion}
                      onClick={() => {
                        onEmotionSubmit(e.emotion);
                        onSubmit();
                      }}
                    >
                      {e.emotion}
                      <span>{e.emoji}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ShineBorder>
      </div>
    </div>
  );
}
