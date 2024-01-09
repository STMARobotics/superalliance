import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { MantineProvider } from "@mantine/core";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import { SuperAllianceProvider } from "@/contexts/SuperAllianceProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        alt: siteConfig.name,
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/images/superalliancelogo.png",
    apple: "/images/superalliancelogo.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col bg-background text-white">
          <ClerkProvider
            appearance={{
              baseTheme: dark,
            }}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              <Toaster richColors theme="dark" />
              <MantineProvider theme={{ primaryColor: "red" }}>
                <SuperAllianceProvider>
                  <Header />
                  <main className="flex-1">{children}</main>
                </SuperAllianceProvider>
              </MantineProvider>
            </ThemeProvider>
          </ClerkProvider>
        </div>
      </body>
    </html>
  );
}
