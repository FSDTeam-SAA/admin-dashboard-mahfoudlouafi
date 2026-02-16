export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Top-Left Organic Shapes */}
      <div className="absolute z-50 left-5 -top-35 h-[292px] w-[133px] rotate-[144deg] rounded-[80px] bg-[rgba(60,75,98,0.95)]" />
      <div className="absolute -left-5 -top-15 h-[292px] w-[133px] rotate-[144deg] rounded-[80px] bg-[#FFB352]" />

      {/* Bottom-Right Organic Shapes */}
      {/* <div className="absolute z-50 -bottom-20 -right-10 h-80 w-44 rotate-[144deg] rounded-[100px] bg-[#4A5568]" />
      <div className="absolute bottom-40 right-0 h-64 w-48 rotate-[144deg] rounded-[100px] bg-[#FFB352]" /> */}

      <div className="absolute z-50 -bottom-30 right-0 h-[292px] w-[133px] rotate-[150deg] rounded-[80px] bg-[rgba(60,75,98,0.95)]" />
      <div className="absolute -bottom-5 -right-10 h-[292px] w-[133px] rotate-[150deg] rounded-[80px] bg-[#FFB352]" />

      {/* Main Content Area */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}