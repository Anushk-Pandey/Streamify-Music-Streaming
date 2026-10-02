import React from "react";
import { ChevronLeft, ChevronRight, Search, Menu, Disc } from "lucide-react";

interface TopbarProps {
  onToggleSidebar: () => void;
  onNavigateHome: () => void;
  onNavigateSearch: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  onNavigateHome,
  onNavigateSearch,
}) => {
  return (
    <header className="h-16 bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={onNavigateHome}
            className="w-8 h-8 rounded-full bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateSearch}
            className="w-8 h-8 rounded-full bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Shortcut */}
        <button
          onClick={onNavigateSearch}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-all w-56 lg:w-72"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search songs, albums, artists...</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>High-Fi Audio</span>
        </div>
      </div>
    </header>
  );
};
