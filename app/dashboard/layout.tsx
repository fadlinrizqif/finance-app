import SignOut from "@/components/signout";
import Link from "next/link";
import { Home, LayoutGrid, Banknote } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (


    <SidebarProvider>
      <AppSidebar />
      <main className="pr-2 w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>


  );
}
