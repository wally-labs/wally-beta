import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@components/ui/dropdown-menu";
import { Gem } from "lucide-react";

export function ModelDropdown() {
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
