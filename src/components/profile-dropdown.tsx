import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Settings } from "lucide-react";

export function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Settings />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
