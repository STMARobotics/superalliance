"use client";

import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Icons } from "./icons";
import { Link } from "react-router-dom";
import { LoginButton } from "@/components/login-button";
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 flex h-14 w-full items-center">
        <MainNav />
        <div className="flex w-full flex-row items-center justify-between space-x-0 sm:hidden">
          <Link to={"/"}>
            <Icons.logo className="h-8 w-8 rounded-xl" />
          </Link>
          <MobileNav />
        </div>
        <div className="flex-1 items-center justify-between space-x-2 md:justify-end hidden sm:flex">
          <nav className="flex items-center gap-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <LoginButton />
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
