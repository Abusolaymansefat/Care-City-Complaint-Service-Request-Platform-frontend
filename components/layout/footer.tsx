import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Building2 className="size-6 text-primary" />
              CityCare
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Report city issues and track their resolution — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold">Platform</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/citizen/complaints/create-poster"
                    className="transition-colors hover:text-foreground"
                  >
                    Report an issue
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="transition-colors hover:text-foreground">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Account</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/register" className="transition-colors hover:text-foreground">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forgot-password"
                    className="transition-colors hover:text-foreground"
                  >
                    Forgot password
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">About</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    Track a report
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          © {year} CityCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
