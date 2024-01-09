"use client";

import { useRouter } from "next/navigation";

function Data() {
  const router = useRouter();
  router.push("/data/forms");
  return <></>;
}

export default Data;
