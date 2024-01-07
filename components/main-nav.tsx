"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useAuth } from "@clerk/nextjs";

export function MainNav() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-8 w-8 rounded-xl" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {userId && (
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/form/stand"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/form/stand")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Stand Form
          </Link>
          <Link
            href="/form/pit"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/form/pit")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Pit Form
          </Link>
          <Link
            href="/data"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/data")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Data
          </Link>
          <Link
            href="/analysis"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/data")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Analysis
          </Link>
        </nav>
      )}
    </div>
  );
}
