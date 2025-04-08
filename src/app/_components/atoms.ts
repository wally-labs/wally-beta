import { atomWithStorage } from "jotai/utils";
import { type z } from "zod";
import { type formSchema } from "./schema";

type chatDataAtom = {
  id: string;
  chatData: z.infer<typeof formSchema> & {
    chatHeader: string;
  };
};

export const chatIdsAtom = atomWithStorage("chatIdAtoms", [] as string[]);
export const chatDataAtom = atomWithStorage(
  "chatDataAtoms",
  [] as chatDataAtom[],
);
