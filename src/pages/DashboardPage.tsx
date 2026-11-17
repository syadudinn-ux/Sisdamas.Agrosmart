import React from 'react';
import {
  ArrowRight,
  CreditCard,
  Egg,
  Leaf,
  Plus,
  Recycle,
  Sprout,
} from 'lucide-react';
import type { AgroDatabase, ModalType, PageId } from '../types';
import {
  computeTotalEggStock,
  computeTotalVegStock,
  formatNumber,
} from '../data/seedData';

interface DashboardPageProps {
  db: AgroDatabase;
  onNavigate: (page: PageId) => void;
  onOpenModal: (modal: ModalType) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  db,
  onNavigate,
  onOpenModal,
}) => {
  const totalVegStock = computeTotalVegStock(db);
  const totalEggStock = computeTotalEggStock(db);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#162e23] sm:text-[26px]">
            Dashboard Program
          </h1>
          <p className="mt-1 text-sm text-[#566d60]">
            Pantau kebun, peternakan, stok pangan, dan aktivitas warga.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal({ kind: 'transaction' })}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18794e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13603e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Catat transaksi</span>
        </button>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Sayuran siap tersedia</span>
            <Leaf className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(totalVegStock)} kg
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Siap distribusi atau barter
          </div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Telur siap tersedia</span>
            <Egg className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(totalEggStock)} butir
          </div>
          <div className="mt-1 text-xs text-[#697e72]">Stok telur saat ini</div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Tanaman aktif</span>
            <Sprout className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(db.crops.length)}
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Jenis/batch tanaman terdata
          </div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Anggota terdaftar</span>
            <CreditCard className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(db.members.length)}
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Pemegang kartu program
          </div>
        </div>
      </div>

      {/* Main 2-column grid: Crop Progress + Activity Log */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-[#dfe8e2] bg-white p-5 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-[#162e23]">
              Perkembangan tanaman
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('kebun')}
              className="inline-flex items-center gap-1 rounded-lg bg-[#eaf6ef] px-3 py-1.5 text-xs font-semibold text-[#18794e] transition-colors hover:bg-[#daf0e3] whitespace-nowrap shrink-0"
            >
              <span>Lihat semua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {db.crops.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[#5a7064]">
                Belum ada data tanaman. Tambahkan tanaman pertama.
              </p>
              <button
                type="button"
                onClick={() => onOpenModal({ kind: 'crop' })}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#d6e2da] bg-white px-3.5 py-2 text-xs font-semibold text-[#162e23] hover:bg-[#f4f8f5]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah tanaman</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#edf2ee]">
              {db.crops.slice(0, 5).map((crop) => {
                const pct = Math.min(100, Math.max(0, crop.progress));
                return (
                  <div key={crop.id} className="py-3.5 first:pt-1 last:pb-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#162e23]">
                          {crop.name}
                        </div>
                        <div className="mt-0.5 text-xs text-[#657b6f] tabular-nums">
                          Ditanam {crop.date} · Estimasi panen{' '}
                          {crop.harvest || '-'}
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-semibold text-[#18794e] tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e9f0eb]">
                      <div
                        className="h-full rounded-full bg-[#229765] transition-all duration-200"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#dfe8e2] bg-white p-5 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-[#162e23]">
              Aktivitas terbaru
            </h2>
            <span className="text-xs text-[#657b6f]">Catatan sistem</span>
          </div>

          {db.activities.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#5a7064]">
              Aktivitas akan muncul setelah panitia memasukkan data.
            </div>
          ) : (
            <div className="divide-y divide-[#edf2ee]">
              {db.activities.slice(0, 6).map((act) => (
                <div key={act.id} className="py-3 first:pt-1 last:pb-1">
                  <div className="text-[13px] font-medium text-[#162e23]">
                    {act.text}
                  </div>
                  <div className="mt-0.5 text-xs text-[#657b6f] tabular-nums">
                    {act.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom 2-column grid: Stock Summary + Management Reminders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-[#dfe8e2] bg-white p-5 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-[#162e23]">
              Ringkasan stok siap disalurkan
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('stok')}
              className="text-xs font-semibold text-[#18794e] hover:underline whitespace-nowrap shrink-0"
            >
              Kelola stok
            </button>
          </div>
          <div className="divide-y divide-[#edf2ee]">
            <div className="flex items-center justify-between py-3 first:pt-1">
              <div className="flex items-center gap-2.5 text-sm text-[#354c40]">
                <Leaf className="h-4 w-4 text-[#18794e]" />
                <span>Sayuran siap tersedia</span>
              </div>
              <span className="font-mono text-sm font-bold text-[#162e23] tabular-nums">
                {formatNumber(totalVegStock)} kg
              </span>
            </div>
            <div className="flex items-center justify-between py-3 last:pb-1">
              <div className="flex items-center gap-2.5 text-sm text-[#354c40]">
                <Egg className="h-4 w-4 text-[#18794e]" />
                <span>Telur siap tersedia</span>
              </div>
              <span className="font-mono text-sm font-bold text-[#162e23] tabular-nums">
                {formatNumber(totalEggStock)} butir
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#dfe8e2] bg-white p-5 lg:col-span-5">
          <h2 className="mb-4 font-display text-base font-bold text-[#162e23]">
            Pengingat pengelolaan
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 rounded-lg border border-[#dcebe1] bg-[#f4faf6] p-3 text-xs leading-relaxed text-[#254d39]">
              <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-[#18794e]" />
              <span>
                Pisahkan tanaman yang masih tumbuh dari sayuran yang sudah
                dipanen dan siap disalurkan.
              </span>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-[#dcebe1] bg-[#f4faf6] p-3 text-xs leading-relaxed text-[#254d39]">
              <Egg className="mt-0.5 h-4 w-4 shrink-0 text-[#18794e]" />
              <span>
                Catat telur yang diproduksi agar jumlah stok siap
                barter/distribusi selalu akurat.
              </span>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-[#dcebe1] bg-[#f4faf6] p-3 text-xs leading-relaxed text-[#254d39]">
              <Recycle className="mt-0.5 h-4 w-4 shrink-0 text-[#18794e]" />
              <span>
                Setiap barter harus menggunakan kartu anggota aktif dan dicatat
                berat sampah organiknya.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
