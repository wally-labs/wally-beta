"use client";

import { type z } from "zod";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

import { Button } from "@components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect } from "react";
import { toast } from "sonner";
import { formSchema, ProfileForm } from "./profile-form";

export default function UpdateProfile() {
  const { chats } = useParams();
  const chatId = Array.isArray(chats) ? chats[0] : chats;

  const { data, isLoading, isSuccess } = api.chat.getChat.useQuery(
    chatId ? { chatId: chatId } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!chatId,
    },
  );

  const updateChatMutation = api.chat.updateChat.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        gender: data.gender,
        birthDate: data.birthDate?.toDateString(),
        relationship: data.relationship,
        heartLevel: data.heartLevel,
        race: data.race ?? "",
        country: data.country ?? "",
        language: data.language ?? "",
      });
    }
  }, [data, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Removes empty values and replaces them with undefined
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) =>
        value !== "" ? [key, value] : [key, undefined],
      ),
    ) as z.infer<typeof formSchema>;

    updateChatMutation.mutate({
      chatId: chatId!,
      birthDate: values.birthDate
        ? new Date(values.birthDate).toISOString()
        : "",
      ...cleanedValues,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="h-[70vh] w-[70vw]">
        <ScrollArea>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below!
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            form={form}
            onSubmit={onSubmit}
            submitLabel="Update Profile"
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
