"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuTrigger>
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
      <DropdownMenu placement="bottom end">
        <DropdownMenuItem onAction={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onAction={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onAction={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}