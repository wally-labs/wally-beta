import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { SidebarProvider, SidebarTrigger } from "@components/ui/sidebar";
import { AppSidebar } from "@components/app-sidebar";
import { MainDropdown } from "../components/main-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
// import ShineBorder from "@components/ui/shine-border";

export const metadata: Metadata = {
  title: "Wally",
  description: "Your personal wellness guru",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <SidebarProvider>
            <AppSidebar />
            <main style={{ flexGrow: 1 }}>
              <div className="fixed top-0 flex w-full items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <MainDropdown />
                </div>
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faCircleUser} color="black" />
                </div>
              </div>
              <div className="mt-4">{children}</div>
            </main>
          </SidebarProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
