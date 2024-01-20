"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function LoginButton() {
  return (
    <Link to={"/login"} className={buttonVariants({ variant: "default" })}>
      Sign In
    </Link>
  );
}
