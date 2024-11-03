import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Gem } from "lucide-react";

export function MainDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>TextMate 1.0</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Models</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Basic</DropdownMenuItem>
        <DropdownMenuItem>
          Premium
          <Gem />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
