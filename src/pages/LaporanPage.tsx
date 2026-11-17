import React from 'react';
import {
  Download,
  Handshake,
  Package,
  Recycle,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import type { AgroDatabase, ModalType } from '../types';
import {
  computeTotalEggOut,
  computeTotalEggProduced,
  computeTotalVegHarvested,
  computeTotalVegOut,
  formatNumber,
} from '../data/seedData';

interface LaporanPageProps {
  db: AgroDatabase;
  onExportCSV: () => void;
  onOpenModal: (modal: ModalType) => void;
}

export const LaporanPage: React.FC<LaporanPageProps> = ({
  db,
  onExportCSV,
  onOpenModal,
}) => {
  const freeTransactions = db.transactions.filter((t) => t.type === 'Gratis');
  const barterTransactions = db.transactions.filter((t) => t.type === 'Barter');
  const totalWasteKg = barterTransactions.reduce(
    (sum, t) => sum + Number(t.waste || 0),
    0
  );
  const totalVegOut = computeTotalVegOut(db);
  const totalEggOut = computeTotalEggOut(db);
  const totalVegHarvested = computeTotalVegHarvested(db);
  const totalEggProduced = computeTotalEggProduced(db);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#162e23] sm:text-[26px]">
            Laporan Program
          </h1>
          <p className="mt-1 text-sm text-[#566d60]">
            Rekap produksi, distribusi pangan, dan pengumpulan sampah organik.
          </p>
        </div>
        <button
          type="button"
          onClick={onExportCSV}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18794e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13603e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e] focus-visible:ring-offset-2"
        >
          <Download className="h-4 w-4" />
          <span>Unduh CSV transaksi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Total distribusi gratis</span>
            <Handshake className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(freeTransactions.length)}
          </div>
          <div className="mt-1 text-xs text-[#697e72]">Transaksi</div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Total transaksi barter</span>
            <Recycle className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(barterTransactions.length)}
          </div>
          <div className="mt-1 text-xs text-[#697e72]">Transaksi</div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Sampah organik terkumpul</span>
            <Recycle className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(totalWasteKg)} kg
          </div>
          <div className="mt-1 text-xs text-[#697e72]">Akumulasi berat</div>
        </div>

        <div className="rounded-xl border border-[#dfe8e2] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#5a7064]">
            <span>Pangan tersalurkan</span>
            <Package className="h-4 w-4 text-[#18794e]" />
          </div>
          <div className="mt-3 font-display text-xl font-bold tracking-tight text-[#162e23] tabular-nums">
            {formatNumber(totalVegOut)} kg · {formatNumber(totalEggOut)} butir
          </div>
          <div className="mt-1 text-xs text-[#697e72]">
            Sayuran & telur terdistribusi
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-[#dfe8e2] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#162e23]">
              Ringkasan program
            </h2>
            <p className="mt-0.5 text-xs text-[#657b6f]">
              Seluruh data tersimpan otomatis di penyimpanan lokal perangkat ini.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenModal({ kind: 'confirmReset', mode: 'sample' })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6e2da] bg-white px-3 py-1.5 text-xs font-semibold text-[#254033] transition-colors hover:bg-[#f4f8f5] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Muat data contoh</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenModal({ kind: 'confirmReset', mode: 'empty' })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#f5c6c4] bg-[#fff5f5] px-3 py-1.5 text-xs font-semibold text-[#b42318] transition-colors hover:bg-[#ffe8e7] whitespace-nowrap"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Kosongkan data</span>
            </button>
          </div>
        </div>

        <dl className="divide-y divide-[#edf2ee] text-sm">
          <div className="flex items-center justify-between py-3">
            <dt className="text-[#4a6255]">Total anggota terdaftar</dt>
            <dd className="font-mono font-semibold text-[#162e23] tabular-nums">
              {formatNumber(db.members.length)} orang
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-[#4a6255]">Total jenis/batch tanaman</dt>
            <dd className="font-mono font-semibold text-[#162e23] tabular-nums">
              {formatNumber(db.crops.length)} batch
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-[#4a6255]">Total hasil panen tercatat</dt>
            <dd className="font-mono font-semibold text-[#162e23] tabular-nums">
              {formatNumber(totalVegHarvested)} kg
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-[#4a6255]">Total produksi telur tercatat</dt>
            <dd className="font-mono font-semibold text-[#162e23] tabular-nums">
              {formatNumber(totalEggProduced)} butir
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-[#4a6255]">Total transaksi tercatat</dt>
            <dd className="font-mono font-semibold text-[#162e23] tabular-nums">
              {formatNumber(db.transactions.length)} transaksi
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
};
