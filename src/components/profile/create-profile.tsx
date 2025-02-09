"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().date().optional(),
  // this should be a list of a few choices (enum)?
  relationship: z.string(),
  heartLevel: z
    .number()
    .int()
    .refine((value) => value >= 1 && value <= 5, {
      message: "Level must be between 1 and 5",
    }),
  race: z.string().optional(),
  country: z.string().optional(),
  // this should be a list of a few choices (enum)?
  language: z.string(),
});

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
  { label: "Malay", value: "ms" },
] as const;

export default function CreateProfile() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      relationship: "",
      heartLevel: 1,
      race: "",
      country: "",
      language: "",
    },
  });

  const createChatMutation = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      console.log("Profile created successfully: ", data);
      // alert("Profile created successfully!");
    },
    onError: (error) => {
      console.log("Failed to create profile: ", error);
      // alert("Failed to create profile, please try again!");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createChatMutation.mutate({ chatHeader: values.name, ...values });
  }

  const { isSignedIn, userId, isLoaded } = useAuth();
  console.log("isSignedIn: ", isSignedIn, "userId: ", userId);

  return (
    <div className="mx-auto mt-16 max-w-3xl p-4">
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
                  Your partner&apos;s birth date
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

          <Button type="submit">Create Profile</Button>
        </form>
      </Form>
    </div>
  );
}
