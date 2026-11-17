import React from 'react';
import {
  BarChart3,
  Egg,
  Handshake,
  LayoutGrid,
  Package,
  Sprout,
  Users,
  X,
} from 'lucide-react';
import type { PageId } from '../types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const NAV_ITEMS: Array<{
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'kebun', label: 'Kebun Sayur', icon: Sprout },
  { id: 'ternak', label: 'Peternakan', icon: Egg },
  { id: 'stok', label: 'Stok Pangan', icon: Package },
  { id: 'distribusi', label: 'Distribusi & Barter', icon: Handshake },
  { id: 'warga', label: 'Data Masyarakat', icon: Users },
  { id: 'laporan', label: 'Laporan', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) => {
  const handleSelect = (page: PageId) => {
    onNavigate(page);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col bg-[#123d2b] px-4 py-6 text-[#eaf5ee]">
      <div className="flex items-center justify-between px-2 pb-7">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#d9f1df] text-[#176442]">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-display text-[15px] font-bold tracking-tight text-white whitespace-nowrap">
              SISDAMAS
            </div>
            <div className="text-[11px] font-medium tracking-[0.14em] text-[#b7d2c1] whitespace-nowrap">
              AGROSMART
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Tutup menu navigasi"
          className="grid h-9 w-9 place-items-center rounded-lg text-[#c9dfd1] hover:bg-white/10 hover:text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pb-2 text-xs font-medium text-[#8fb6a0]">
        Menu utama
      </div>

      <nav className="grid gap-1" aria-label="Navigasi utama">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fd3ae] ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-[#c9dfd1] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/15 px-2 pt-4 text-xs leading-relaxed text-[#b7d2c1]">
        <div>Sistem Pengelolaan Pangan Komunitas</div>
        <div className="mt-0.5 text-[#8fb6a0]">© SISDAMAS AGROSMART</div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[250px] md:block">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#0d2419]/60 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-50 h-full w-[260px] max-w-[82vw] shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
