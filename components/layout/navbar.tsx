"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { Button, LinkButton } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ThemeToggle from "./theme-toggle";
import UserMenu from "./user-menu";
import { useAuthStore } from "@/store/auth.store";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    ...(user
      ? [
          { href: "/complaints", label: "My Complaints" },
          { href: "/complaints/new", label: "Report Issue" },
        ]
      : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Building2 className="h-6 w-6 text-primary" />
          CityCare
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === l.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {!mounted ? (
              <div className="h-9 w-24" />
            ) : user ? (
              <UserMenu />
            ) : (
              <>
                <LinkButton variant="ghost" href="/login">Login</LinkButton>
                <LinkButton href="/register">Register</LinkButton>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onPress={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <SheetContent isOpen={open} onOpenChange={setOpen} side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>CityCare</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                      pathname === l.href && "bg-accent text-primary"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}

                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  {mounted && user ? (
                    <>
                      <p className="px-3 text-sm text-muted-foreground">{user.email}</p>
                      <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <LinkButton variant="outline" href="/login" onPress={() => setOpen(false)}>
                        Login
                      </LinkButton>
                      <LinkButton href="/register" onPress={() => setOpen(false)}>
                        Register
                      </LinkButton>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
        </div>
      </div>
    </header>
  );
}