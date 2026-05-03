import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="-ml-1" />
    </header>
  );
}
