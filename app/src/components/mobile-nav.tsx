"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { LoginButton } from "./login-button";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();

  return (
    <div className="flex gap-3 flex-row">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="py-0 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M3 5H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 12H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 19H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="pr-0 w-full">
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <Icons.logo className="mr-2 h-4 w-4" />
            <span className="font-bold">{siteConfig.name}</span>
          </MobileLink>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              <MobileLink href={"/new/stand"} onOpenChange={setOpen}>
                Stand Form
              </MobileLink>
              <MobileLink href={"/new/comments"} onOpenChange={setOpen}>
                Comments Form
              </MobileLink>
              <MobileLink href={"/new/pit"} onOpenChange={setOpen}>
                Pit Form
              </MobileLink>
              {user?.publicMetadata.role == "admin" && (
                <>
                <MobileLink href={"/data"} onOpenChange={setOpen}>
                  Data
                </MobileLink>
                <MobileLink href={"/analysis"} onOpenChange={setOpen}>
                  Analysis
                </MobileLink>
                <MobileLink href={"/admin"} onOpenChange={setOpen}>
                  Admin
                </MobileLink>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <SignedIn>
        <div className="px-0 py-0 pt-0.5">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <LoginButton />
      </SignedOut>
    </div>
  );
}

interface MobileLinkProps {
  href: string | URL;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  return (
    <Link
      to={href}
      onClick={() => {
        navigate(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {pathname?.startsWith(href.toString()) && href.toString() !== "/"
        ? "> "
        : ""}{" "}
      {children}
    </Link>
  );
}
