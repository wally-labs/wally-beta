"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModelDropdown } from "./model-dropdown";
import { SidebarTrigger } from "./ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

export function Header({
  children,
  state,
}: Readonly<{ children: React.ReactNode; state: string }>) {
  return (
    <main style={{ flexGrow: 1 }}>
      <div className="fixed top-0 flex w-full items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {state === "collapsed" && <SidebarTrigger />}
          <ModelDropdown />
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
  );
}
