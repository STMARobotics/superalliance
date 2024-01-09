"use client";

function DataLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-[calc(100vh-3.6rem)] w-full">{children}</div>;
}

export default DataLayout;
