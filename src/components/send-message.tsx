// import { Button } from "@components/ui/button";
import { CircleArrowRight } from "lucide-react";
import ShineBorder from "./ui/shine-border";

export function SendMessage() {
  return (
    <div>
      <label htmlFor="newMessage" className="sr-only">
        Send a Message
      </label>

      {/* <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <textarea
          id="newMessage"
          className="w-full resize-none border-none p-3 align-top focus:outline-none focus:ring-2 sm:text-sm"
          rows={2}
          placeholder="Send a Message to TextMate"
        ></textarea>
        <div className="flex items-center justify-end gap-2 bg-white p-3">
          <Button variant="secondary">Clear</Button>
          <Button variant="blue">Send Message</Button>
        </div>
      </div> */}

      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <ShineBorder
          className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          {" "}
          <textarea
            id="newMessage"
            className="w-full resize-none border-none bg-inherit p-4 focus:outline-none sm:text-sm"
            rows={1}
            placeholder="Send a Message to TextMate"
          ></textarea>
          <div className="flex items-center gap-2 p-4">
            {/* <Button variant="secondary">Clear</Button> */}
            <CircleArrowRight className="text-lg" />
          </div>
        </ShineBorder>
      </div>
    </div>
  );
}
