import React, { useMemo, useState } from 'react';
import { Handshake, Info, Plus, Recycle, Search } from 'lucide-react';
import type { AgroDatabase, ModalType, TransactionType } from '../types';
import { formatNumber } from '../data/seedData';

interface DistribusiPageProps {
  db: AgroDatabase;
  onOpenModal: (modal: ModalType) => void;
}

export const DistribusiPage: React.FC<DistribusiPageProps> = ({
  db,
  onOpenModal,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.transactions
      .filter((t) => {
        if (filterType !== 'all' && t.type !== filterType) return false;
        if (!q) return true;
        return `${t.person} ${t.type} ${t.vegName} ${t.card} ${t.category}`
          .toLowerCase()
          .includes(q);
      })
      .slice()
      .reverse();
  }, [db.transactions, query, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#162e23] sm:text-[26px]">
            Distribusi & Barter
          </h1>
          <p className="mt-1 text-sm text-[#566d60]">
            Catat pangan yang diberikan gratis atau ditukar dengan sampah
            organik.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal({ kind: 'transaction' })}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18794e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13603e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Transaksi baru</span>
        </button>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-[#dcebe1] bg-[#f4faf6] px-4 py-3 text-xs leading-relaxed text-[#254d39]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#18794e]" />
        <span>
          <strong className="font-semibold">Aturan program:</strong> anak-anak,
          ibu hamil, dan lansia menerima pangan secara gratis sesuai ketentuan
          panitia. Masyarakat umum melakukan barter dengan sampah organik dan
          wajib menunjukkan kartu program aktif.
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#697e72]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, komoditas, atau kartu..."
            className="w-full rounded-lg border border-[#d6e2da] bg-white py-2 pr-3 pl-9 text-sm text-[#162e23] focus:border-[#18794e] focus:outline-none focus:ring-2 focus:ring-[#18794e]/20"
          />
        </div>

        <div
          className="inline-flex w-fit items-center gap-1 rounded-lg border border-[#dce6df] bg-[#eef3ef] p-1"
          role="group"
          aria-label="Filter jenis transaksi"
        >
          {(
            [
              { id: 'all', label: 'Semua transaksi' },
              { id: 'Gratis', label: 'Distribusi gratis' },
              { id: 'Barter', label: 'Barter organik' },
            ] as const
          ).map((tab) => {
            const active = filterType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-[#162e23] shadow-xs'
                    : 'text-[#556b5f] hover:text-[#162e23]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#dfe8e2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5ece7] bg-[#f8fbf9] text-xs font-semibold text-[#5a7064]">
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Warga</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">Pangan keluar</th>
                <th className="px-4 py-3">Sampah masuk</th>
                <th className="px-4 py-3">Kartu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ee] text-[13px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="text-sm font-medium text-[#3b5246]">
                      Belum ada transaksi yang sesuai.
                    </div>
                    <p className="mt-1 text-xs text-[#657b6f]">
                      Catat penyaluran gratis atau penukaran barter organik.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((trx) => {
                  const foodParts: string[] = [];
                  if (trx.veg > 0) {
                    foodParts.push(
                      `${trx.vegName} ${formatNumber(trx.veg)} kg`
                    );
                  }
                  if (trx.egg > 0) {
                    foodParts.push(`${formatNumber(trx.egg)} butir telur`);
                  }
                  return (
                    <tr
                      key={trx.id}
                      className="transition-colors hover:bg-[#f9fcf9]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[#4a6255] tabular-nums">
                        {trx.date}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#162e23]">
                          {trx.person}
                        </div>
                        <div className="text-xs text-[#657b6f]">
                          {trx.category}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {trx.type === 'Barter' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a96913]">
                            <Recycle className="h-3.5 w-3.5 shrink-0" />
                            <span>Barter</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18794e]">
                            <Handshake className="h-3.5 w-3.5 shrink-0" />
                            <span>Gratis</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#162e23] tabular-nums">
                        {foodParts.join(' · ') || '-'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#354c40] tabular-nums">
                        {trx.waste > 0 ? `${formatNumber(trx.waste)} kg` : '-'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-[#4a6255] tabular-nums">
                        {trx.card || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
