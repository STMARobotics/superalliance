"use client";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useAuth, useUser } from "@clerk/clerk-react";

export function MainNav() {
  const pathname = useLocation().pathname;
  const { userId } = useAuth();
  const { user } = useUser();

  return (
    <div className="mr-4 hidden md:flex">
      <Link to="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-8 w-8 rounded-xl" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {userId && (
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/new/stand"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/new/stand")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Stand Form
          </Link>
          <Link
            to="/new/comments"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/new/comments")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Comments Form
          </Link>
          <Link
            to="/new/pit"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/new/pit")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Pit Form
          </Link>
          <Link
            to="/data"
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
            to="/analysis"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/analysis")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Analysis
          </Link>
          {user?.publicMetadata.role == "admin" && (
            <Link
              to="/admin"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/admin")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Admin
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
