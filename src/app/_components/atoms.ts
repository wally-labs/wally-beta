"use client";

import { atomWithStorage } from "jotai/utils";
import { type z } from "zod";
import { type formSchema } from "./schema";
import { focusAtom } from "jotai-optics";
import { type Atom } from "jotai";
import { useMemo } from "react";

type chatDataSchema = {
  id: string;
  chatData: z.infer<typeof formSchema> & {
    chatHeader: string;
  };
};

export const chatIdsAtom = atomWithStorage("chatIdAtoms", [] as string[]);
export const chatDataAtom = atomWithStorage(
  "chatDataAtoms",
  [] as chatDataSchema[],
);

export function useCurrentChatData(
  chatId: string,
): Atom<chatDataSchema | undefined> {
  // memoize focusedChatAtom, so only recalculates when chatId changes
  const focusedChatAtom = useMemo(
    () =>
      focusAtom(chatDataAtom, (optic) =>
        optic.find((chat) => chat.id === chatId),
      ),
    [chatId],
  );

  // return updater to the focusedChatAtom
  return focusedChatAtom;
}
