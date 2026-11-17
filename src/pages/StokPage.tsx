import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Egg,
  Leaf,
  PackageCheck,
  Plus,
} from 'lucide-react';
import type { AgroDatabase, ModalType } from '../types';
import {
  computeTotalEggStock,
  computeTotalVegHarvested,
  computeTotalVegStock,
  computeVegStockByName,
  formatNumber,
} from '../data/seedData';

interface StokPageProps {
  db: AgroDatabase;
  onOpenModal: (modal: ModalType) => void;
}

export const StokPage: React.FC<StokPageProps> = ({ db, onOpenModal }) => {
  const totalVegAvailable = computeTotalVegStock(db);
  const totalEggAvailable = computeTotalEggStock(db);
  const totalVegHarvested = computeTotalVegHarvested(db);
  const vegByName = Object.entries(computeVegStockByName(db));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#162e23] sm:text-[26px]">
            Stok Pangan
          </h1>
          <p className="mt-1 text-sm text-[#566d60]">
            Stok siap barter dan siap distribusi, terpisah dari tanaman yang
            masih tumbuh.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal({ kind: 'harvest' })}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18794e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13603e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Masukkan hasil panen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Total sayuran siap tersedia</span>
            <Leaf className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(totalVegAvailable)} kg
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Stok setelah distribusi dan barter
          </div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Total telur siap tersedia</span>
            <Egg className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(totalEggAvailable)} butir
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Stok setelah distribusi dan barter
          </div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Hasil panen masuk</span>
            <PackageCheck className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(totalVegHarvested)} kg
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Akumulasi sayuran dipanen
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-[#dfe8e2] bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-bold text-[#162e23]">
            Rincian stok sayuran siap disalurkan
          </h2>
          <span className="text-xs text-[#657b6f]">Per jenis komoditas</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#e5ece7]">
          <table className="w-full min-w-[480px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5ece7] bg-[#f8fbf9] text-xs font-semibold text-[#5a7064]">
                <th className="px-4 py-3">Jenis sayuran</th>
                <th className="px-4 py-3">Stok tersedia</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ee] text-[13px]">
              {vegByName.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center">
                    <div className="text-sm font-medium text-[#3b5246]">
                      Belum ada hasil panen masuk ke stok.
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenModal({ kind: 'harvest' })}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#18794e] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#13603e]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Masukkan hasil panen</span>
                    </button>
                  </td>
                </tr>
              ) : (
                vegByName.map(([name, qty]) => {
                  const available = qty > 0;
                  return (
                    <tr
                      key={name}
                      className="transition-colors hover:bg-[#f9fcf9]"
                    >
                      <td className="px-4 py-3 font-semibold text-[#162e23]">
                        {name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[#162e23] tabular-nums">
                        {formatNumber(Math.max(0, qty))} kg
                      </td>
                      <td className="px-4 py-3">
                        {available ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18794e]">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>Tersedia</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b42318]">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>Habis</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
