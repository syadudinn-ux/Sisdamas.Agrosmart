import React from 'react';
import { Calendar, Egg, Layers, Plus, Settings2 } from 'lucide-react';
import type { AgroDatabase, ModalType } from '../types';
import {
  computeTotalEggProduced,
  computeTotalEggStock,
  formatNumber,
  todayISO,
} from '../data/seedData';

interface TernakPageProps {
  db: AgroDatabase;
  onOpenModal: (modal: ModalType) => void;
}

export const TernakPage: React.FC<TernakPageProps> = ({ db, onOpenModal }) => {
  const today = todayISO();
  const eggProduced = computeTotalEggProduced(db);
  const eggStock = computeTotalEggStock(db);
  const eggToday = db.eggs
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + Number(e.qty || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#162e23] sm:text-[26px]">
            Peternakan Ayam Petelur
          </h1>
          <p className="mt-1 text-sm text-[#566d60]">
            Pantau populasi ayam dan catat produksi telur harian.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal({ kind: 'egg' })}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18794e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13603e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Catat produksi telur</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Jumlah ayam</span>
            <Layers className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(db.hens)} ekor
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Populasi ayam petelur
          </div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Produksi tercatat</span>
            <Egg className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(eggProduced)} butir
          </div>
          <div className="mt-1 text-xs text-[#697e72]">Akumulasi produksi</div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Stok telur</span>
            <Egg className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(eggStock)} butir
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Siap distribusi/barter
          </div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Produksi hari ini</span>
            <Calendar className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(eggToday)} butir
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Berdasarkan tanggal hari ini
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-[#dfe8e2] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-bold text-[#162e23]">
            Riwayat produksi telur
          </h2>
          <button
            type="button"
            onClick={() => onOpenModal({ kind: 'hen' })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#eaf6ef] px-3 py-1.5 text-xs font-semibold text-[#18794e] transition-colors hover:bg-[#daf0e3] whitespace-nowrap shrink-0"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Atur jumlah ayam</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#e5ece7]">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5ece7] bg-[#f8fbf9] text-xs font-semibold text-[#5a7064]">
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Jumlah produksi</th>
                <th className="px-4 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ee] text-[13px]">
              {db.eggs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center">
                    <div className="text-sm font-medium text-[#3b5246]">
                      Belum ada catatan produksi telur.
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenModal({ kind: 'egg' })}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#18794e] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#13603e]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Catat produksi pertama</span>
                    </button>
                  </td>
                </tr>
              ) : (
                db.eggs
                  .slice()
                  .reverse()
                  .map((rec) => (
                    <tr
                      key={rec.id}
                      className="transition-colors hover:bg-[#f9fcf9]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[#4a6255] tabular-nums">
                        {rec.date}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#162e23] tabular-nums">
                        {formatNumber(rec.qty)} butir
                      </td>
                      <td className="px-4 py-3 text-[#4a6255]">
                        {rec.note || '-'}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
