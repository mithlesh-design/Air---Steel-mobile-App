import { Menu } from "lucide-react";
import { useMenu } from "../../context/MenuContext";

export function FloatingMenuButton() {
  const { toggleMenu } = useMenu();

  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
      <button 
        onClick={toggleMenu}
        className="pointer-events-auto flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] text-white px-5 py-3 rounded-full hover:bg-[#222] transition-colors shadow-2xl backdrop-blur-md"
      >
        <Menu size={14} />
        <span className="text-[10px] uppercase tracking-widest font-medium">Menu</span>
      </button>
    </div>
  );
}
