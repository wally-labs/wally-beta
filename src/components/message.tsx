// this component is from https://www.hyperui.dev/components/application-ui/textareas

import { Button } from "@components/ui/button";

export function Message() {
  return (
    <div>
      <label htmlFor="OrderNotes" className="sr-only">
        Order notes
      </label>

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <textarea
          id="newMessage"
          className="w-full resize-none border-none p-3 align-top focus:outline-none focus:ring-2 sm:text-sm"
          rows={4}
          placeholder="Send a Message to TextMate"
        ></textarea>
        <div className="flex items-center justify-end gap-2 bg-white p-3">
          <Button variant="secondary">Clear</Button>
          <Button variant="blue">Send Message</Button>
        </div>
      </div>
    </div>
  );
}
