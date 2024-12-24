"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModelDropdown } from "./model-dropdown";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";

export function Header({
  children,
  state,
}: Readonly<{ children: React.ReactNode; state: string }>) {
  return (
    <main style={{ flexGrow: 1 }}>
      <div className="flex w-full items-center justify-between space-x-4 p-4">
        <div className="flex items-center space-x-4">
          {state === "collapsed" && <SidebarTrigger />}
          <ModelDropdown />
        </div>
        <div className="space-x-4">
          <SignedOut>
            <SignInButton>
              <Button variant="blue">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </main>
  );
}
