import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import MainSidebar from "~/app/_components/global/nav-bar";

import { SidebarProvider } from "@components/ui/sidebar";

export const metadata: Metadata = {
  title: "Wally",
  description: "Your personal wellness guru",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>
            <SidebarProvider>
              <MainSidebar>{children}</MainSidebar>
            </SidebarProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
