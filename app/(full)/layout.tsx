import { FullHeader } from "@/components/layout/FullHeader";

export default function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-8 py-8">
      <FullHeader />
      <div className="mt-8">{children}</div>
    </div>
  );
}
