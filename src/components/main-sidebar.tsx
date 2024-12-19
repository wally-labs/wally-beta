"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppSidebar } from "./app-sidebar";
import { MainDropdown } from "./main-dropdown";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { faCircleUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function MainSidebar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { state } = useSidebar();

  return (
    <>
      <AppSidebar>
        {state === "expanded" && (
          <>
            <SidebarTrigger />
            <FontAwesomeIcon icon={faSearch} />
          </>
        )}
      </AppSidebar>
      <main style={{ flexGrow: 1 }}>
        <div className="fixed top-0 flex w-full items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            {state === "collapsed" && <SidebarTrigger />}
            <MainDropdown />
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faCircleUser} color="black" />
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </main>
    </>
  );
}
