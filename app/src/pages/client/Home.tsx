"use client";

import { cn } from "@/lib/utils";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>The Most Advanced Scouting Tool</PageHeaderHeading>
        <PageHeaderDescription>
          Super Alliance is the most technologically advanced scouting tool for
          First Teams across the globe, with an easy to use form interface and
          data analytics like never seen before.
        </PageHeaderDescription>
        <PageActions>
          <Link
            to="/new/stand"
            className={cn(
              buttonVariants(),
              "bg-red-600 text-white hover:bg-red-800"
            )}
          >
            New Stand Form
          </Link>
          <Link
            to="/new/pit"
            className={cn(
              buttonVariants(),
              "bg-red-600 text-white hover:bg-red-800"
            )}
          >
            New Pit Form
          </Link>
        </PageActions>
      </PageHeader>
    </div>
  );
}
