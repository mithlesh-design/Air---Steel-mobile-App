import { cn } from "../../lib/utils";

interface MobileWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MobileWrapper({ children, className, ...props }: MobileWrapperProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center w-full">
      {/* Desktop decorative frame */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
        <div
          className="w-[400px] rounded-[44px] border border-white/[0.06]"
          style={{ height: "calc(100vh - 32px)", maxHeight: "900px" }}
        />
      </div>

      <div
        className={cn(
          "w-full max-w-[400px] bg-[#0A0A0A] relative flex flex-col overflow-hidden",
          "h-screen md:h-[min(900px,calc(100vh-32px))]",
          "md:rounded-[44px] md:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] md:border md:border-white/[0.06]",
          className
        )}
        {...props}
      >
        {/* Subtle top edge glow on desktop */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-white/10 rounded-full" />
        {children}
      </div>
    </div>
  );
}
