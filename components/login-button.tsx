"use client";

import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function LoginButton() {
  const router = useRouter();

  return (
    <Link href={"/login"} className={buttonVariants({ variant: "default" })}>
      Sign In
    </Link>
  );
}
