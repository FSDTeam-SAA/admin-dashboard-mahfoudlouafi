import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* 1. Fix the outer container to the screen height and hide its overflow */
    <div className="relative h-screen w-full bg-[#FDFDFD] overflow-hidden">
      <div className="flex h-full relative z-10">
        
        {/* Sidebar: Inherits h-full, should have its own overflow-y-auto internally */}
        <Sidebar />

        {/* Content Wrapper: Takes remaining width and full height */}
        <div className="flex flex-1 flex-col min-w-0 h-full">
          
          {/* Topbar: Fixed at the top, does not scroll */}
          <div className="px-6 py-4 lg:px-10 flex-shrink-0">
            <Topbar />
          </div>

          {/* Main: This is the ONLY part that scrolls */}
          <main className="flex-1 overflow-y-auto px-6 pb-8 pt-4 lg:px-10 scrollbar-hide">
            <div className="">
               {children}
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}