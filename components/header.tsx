"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/src/contexts/auth-context";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

export function Header() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = isLoading
    ? "Carregando..."
    : user?.name || user?.email || "Usuário não autenticado";

  const handleLogout = () => {
    if (!user) {
      router.push("/");
      return;
    }

    try {
      signOut();
    } finally {
      router.push("/");
    }
  };

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        {/* <div className="text-lg font-semibold">xphub</div> */}
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "z-50 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            )}
            align="start"
          >
            <Link
              href="/app/"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              Experiences
            </Link>
            <Link
              href="/app/tags"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              Tags
            </Link>
          </PopoverContent>
        </Popover>
        <span className="text-sm text-muted-foreground">{displayName}</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLogout}
        disabled={isLoading}
        aria-label="Log out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
}
