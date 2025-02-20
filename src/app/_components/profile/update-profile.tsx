"use client";

import { type z } from "zod";
import { cn } from "~/lib/utils";

import { formSchema } from "./create-profile";
import { languages } from "./create-profile";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect } from "react";

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
      console.log("Chat updated successfully");
    },
    onError: (error) => {
      console.error("Error updating chat", error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      birthDate: "",
      relationship: "",
      heartLevel: 1,
      race: "",
      country: "",
      language: "",
    },
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
    updateChatMutation.mutate({
      chatId: chatId!,
      birthDate: values.birthDate
        ? new Date(values.birthDate).toISOString()
        : "",
      ...values,
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
          {/* {isLoading && <Skeleton />} */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>Your partner&apos;s name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your partner&apos;s gender
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Date field */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="your partner's birth date"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your partner&apos;s birth date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Relationship Field */}
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a relationship type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friendship">Friendship</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your partner&apos;s relationship with you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heart Level Field  */}
              <FormField
                control={form.control}
                name="heartLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart Level</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a heart level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your partner&apos;s heart level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Race Field */}
              <FormField
                control={form.control}
                name="race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a race" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="malay">Malay</SelectItem>
                        <SelectItem value="indian">Indian</SelectItem>
                        <SelectItem value="eurasian">Eurasian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your partner&apos;s race</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country Field */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="singapore">Singapore</SelectItem>
                        <SelectItem value="malaysia">Malaysia</SelectItem>
                        <SelectItem value="china">China</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your partner&apos;s race</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language Field - small issue combobox is different color :(( */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Language</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="secondary"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? languages.find(
                                  (language) => language.value === field.value,
                                )?.label
                              : "Select language"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search language..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Language not available.</CommandEmpty>
                            <CommandGroup>
                              {languages.map((language) => (
                                <CommandItem
                                  value={language.label}
                                  key={language.value}
                                  onSelect={() => {
                                    form.setValue("language", language.value);
                                  }}
                                >
                                  {language.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      language.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your partner&apos;s native language
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Profile</Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
