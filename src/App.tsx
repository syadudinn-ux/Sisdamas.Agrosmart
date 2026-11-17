import { useEffect, useState } from 'react';
import { Menu, Sprout } from 'lucide-react';
import type {
  AgroDatabase,
  MemberCategory,
  MemberStatus,
  ModalType,
  PageId,
  TransactionType,
} from './types';
import {
  createSampleDB,
  EMPTY_DB,
  formatTodayLong,
} from './data/seedData';
import { NAV_ITEMS, Sidebar } from './components/Sidebar';
import { Modals } from './components/Modals';
import { DashboardPage } from './pages/DashboardPage';
import { KebunPage } from './pages/KebunPage';
import { TernakPage } from './pages/TernakPage';
import { StokPage } from './pages/StokPage';
import { DistribusiPage } from './pages/DistribusiPage';
import { WargaPage } from './pages/WargaPage';
import { LaporanPage } from './pages/LaporanPage';

const STORAGE_KEY = 'sisdamas_agrosmart_db_v1';

function loadInitialDB(): AgroDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSampleDB();
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY_DB,
      ...parsed,
    };
  } catch {
    return createSampleDB();
  }
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowTimestamp(): string {
  return new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function App() {
  const [db, setDb] = useState<AgroDatabase>(loadInitialDB);
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalType | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [db]);

  const currentNav = NAV_ITEMS.find((n) => n.id === activePage);

  const pushActivity = (
    prev: AgroDatabase,
    text: string
  ): AgroDatabase['activities'] => {
    return [
      { id: makeId('act'), text, date: nowTimestamp() },
      ...prev.activities,
    ].slice(0, 12);
  };

  const handleAddCrop = (data: {
    name: string;
    date: string;
    harvest: string;
    progress: number;
  }) => {
    setDb((prev) => ({
      ...prev,
      crops: [{ id: makeId('crop'), ...data }, ...prev.crops],
      activities: pushActivity(
        prev,
        `Tanaman ${data.name} ditambahkan ke kebun`
      ),
    }));
  };

  const handleUpdateCropProgress = (cropId: string, progress: number) => {
    setDb((prev) => {
      const target = prev.crops.find((c) => c.id === cropId);
      if (!target) return prev;
      return {
        ...prev,
        crops: prev.crops.map((c) =>
          c.id === cropId ? { ...c, progress } : c
        ),
        activities: pushActivity(
          prev,
          `Progres ${target.name} diperbarui menjadi ${progress}%`
        ),
      };
    });
  };

  const handleAddEgg = (data: { date: string; qty: number; note: string }) => {
    setDb((prev) => ({
      ...prev,
      eggs: [...prev.eggs, { id: makeId('egg'), ...data }],
      activities: pushActivity(
        prev,
        `Produksi telur dicatat: ${data.qty} butir`
      ),
    }));
  };

  const handleUpdateHens = (hens: number) => {
    setDb((prev) => ({
      ...prev,
      hens,
      activities: pushActivity(
        prev,
        `Populasi ayam diperbarui: ${hens} ekor`
      ),
    }));
  };

  const handleAddHarvest = (data: {
    name: string;
    qty: number;
    date: string;
  }) => {
    setDb((prev) => ({
      ...prev,
      veg: [...prev.veg, { id: makeId('veg'), ...data }],
      activities: pushActivity(
        prev,
        `Hasil panen ${data.name} sebanyak ${data.qty} kg masuk stok`
      ),
    }));
  };

  const handleAddMember = (data: {
    name: string;
    address: string;
    category: MemberCategory;
    card: string;
    status: MemberStatus;
  }) => {
    setDb((prev) => ({
      ...prev,
      members: [...prev.members, { id: makeId('mem'), ...data }],
      activities: pushActivity(prev, `Anggota ${data.name} didaftarkan`),
    }));
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setDb((prev) => {
      const target = prev.members.find((m) => m.id === memberId);
      if (!target) return prev;
      const nextStatus: MemberStatus =
        target.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      return {
        ...prev,
        members: prev.members.map((m) =>
          m.id === memberId ? { ...m, status: nextStatus } : m
        ),
        activities: pushActivity(
          prev,
          `Status kartu ${target.name} (${target.card}) diubah menjadi ${nextStatus}`
        ),
      };
    });
  };

  const handleAddTransaction = (data: {
    type: TransactionType;
    card: string;
    person: string;
    category: MemberCategory;
    vegName: string;
    veg: number;
    egg: number;
    waste: number;
    date: string;
  }) => {
    setDb((prev) => ({
      ...prev,
      transactions: [...prev.transactions, { id: makeId('trx'), ...data }],
      activities: pushActivity(
        prev,
        `${
          data.type === 'Barter' ? 'Barter' : 'Distribusi gratis'
        } untuk ${data.person} berhasil dicatat`
      ),
    }));
  };

  const handleResetDB = (mode: 'empty' | 'sample') => {
    setDb(mode === 'empty' ? EMPTY_DB : createSampleDB());
  };

  const handleExportCSV = () => {
    const rows: Array<Array<string | number>> = [
      [
        'Tanggal',
        'Nama',
        'Kategori',
        'Jenis',
        'Sayuran',
        'Kg sayur',
        'Telur butir',
        'Sampah organik kg',
        'Nomor kartu',
      ],
      ...db.transactions.map((t) => [
        t.date,
        t.person,
        t.category,
        t.type,
        t.vegName || '',
        t.veg,
        t.egg,
        t.waste,
        t.card,
      ]),
    ];

    const csv = rows
      .map((r) =>
        r.map((x) => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'laporan-sisdamas-agrosmart.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-[#162e23]">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Compact Header (< 768px) */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#dfe8e2] bg-[#123d2b] px-4 text-white md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#d9f1df] text-[#176442]">
            <Sprout className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight whitespace-nowrap">
            SISDAMAS AGROSMART
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Buka menu navigasi"
          className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <div className="md:pl-[250px]">
        <div className="mx-auto max-w-[1220px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Desktop Contextual Top Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2ebe5] pb-4">
            <div className="text-xs text-[#5d7367]">
              <span>Program Pemberdayaan Masyarakat</span>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-[#162e23]">
                {currentNav?.label}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-[#5d7367] tabular-nums sm:inline">
                {formatTodayLong()}
              </span>
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#dcefe2] font-display text-xs font-bold text-[#18794e]">
                  A
                </div>
                <span className="text-xs font-semibold text-[#162e23] whitespace-nowrap">
                  Admin Panitia
                </span>
              </div>
            </div>
          </div>

          <main>
            {activePage === 'dashboard' && (
              <DashboardPage
                db={db}
                onNavigate={setActivePage}
                onOpenModal={setModal}
              />
            )}
            {activePage === 'kebun' && (
              <KebunPage db={db} onOpenModal={setModal} />
            )}
            {activePage === 'ternak' && (
              <TernakPage db={db} onOpenModal={setModal} />
            )}
            {activePage === 'stok' && (
              <StokPage db={db} onOpenModal={setModal} />
            )}
            {activePage === 'distribusi' && (
              <DistribusiPage db={db} onOpenModal={setModal} />
            )}
            {activePage === 'warga' && (
              <WargaPage
                db={db}
                onOpenModal={setModal}
                onToggleMemberStatus={handleToggleMemberStatus}
              />
            )}
            {activePage === 'laporan' && (
              <LaporanPage
                db={db}
                onExportCSV={handleExportCSV}
                onOpenModal={setModal}
              />
            )}
          </main>
        </div>
      </div>

      <Modals
        modal={modal}
        db={db}
        onClose={() => setModal(null)}
        onAddCrop={handleAddCrop}
        onUpdateCropProgress={handleUpdateCropProgress}
        onAddEgg={handleAddEgg}
        onUpdateHens={handleUpdateHens}
        onAddHarvest={handleAddHarvest}
        onAddMember={handleAddMember}
        onAddTransaction={handleAddTransaction}
        onResetDB={handleResetDB}
      />
    </div>
  );
}
