"use client";

import { SidebarTrigger, useSidebar } from "@components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppSidebar } from "./app-sidebar";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Header } from "./header";

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
      <Header state={state}>{children}</Header>
    </>
  );
}
