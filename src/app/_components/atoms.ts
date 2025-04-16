"use client";

import { atomWithStorage } from "jotai/utils";
import { type z } from "zod";
import { type formSchema } from "./schema";
import { focusAtom } from "jotai-optics";
import type { Atom } from "jotai";
import { useMemo } from "react";

export type chatDataSchema = {
  id: string;
  chatData: z.infer<typeof formSchema> & {
    chatHeader: string;
  };
};

// Ensure we have access to sessionStorage only in a client environment:
// const storage: SyncStorage<Value> = () => {
//   if (typeof window === "undefined") {
//     return undefined;
//   }
//   return createJSONStorage(() => sessionStorage);
// };

export const chatDataAtom = atomWithStorage(
  "chatDataAtoms",
  [] as chatDataSchema[],
);

export function useCurrentChatData(chatId: string): Atom<chatDataSchema> {
  // memoize focusedChatAtom, so only recalculates when chatId changes
  const focusedChatAtom = useMemo(
    () =>
      focusAtom(chatDataAtom, (optic) =>
        optic.find((chat) => chat.id === chatId),
      ),
    [chatId],
  );

  // throw error if chatId is not found and there is no focusedChatAtom
  if (!focusedChatAtom) {
    throw new Error(`Chat data with id ${chatId} not found`);
  }

  // return data & updater to the focusedChatAtom
  return focusedChatAtom as Atom<chatDataSchema>;
}
