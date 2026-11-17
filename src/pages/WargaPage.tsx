import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import type { AgroDatabase, MemberCategory, ModalType } from '../types';

interface WargaPageProps {
  db: AgroDatabase;
  onOpenModal: (modal: ModalType) => void;
  onToggleMemberStatus: (memberId: string) => void;
}

export const WargaPage: React.FC<WargaPageProps> = ({
  db,
  onOpenModal,
  onToggleMemberStatus,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MemberCategory>(
    'all'
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.members.filter((m) => {
      if (categoryFilter !== 'all' && m.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return `${m.name} ${m.card} ${m.address} ${m.category}`
        .toLowerCase()
        .includes(q);
    });
  }, [db.members, query, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#162e23] sm:text-[26px]">
            Data Masyarakat
          </h1>
          <p className="mt-1 text-sm text-[#566d60]">
            Kelola anggota, kategori penerima manfaat, dan kartu program.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal({ kind: 'member' })}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18794e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13603e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah anggota</span>
        </button>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-[#dcebe1] bg-[#f4faf6] px-4 py-3 text-xs leading-relaxed text-[#254d39]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#18794e]" />
        <span>
          Setiap anggota memiliki nomor kartu unik. Kartu aktif menjadi syarat
          transaksi distribusi maupun barter masyarakat umum.
        </span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#697e72]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau nomor kartu..."
            className="w-full rounded-lg border border-[#d6e2da] bg-white py-2 pr-3 pl-9 text-sm text-[#162e23] focus:border-[#18794e] focus:outline-none focus:ring-2 focus:ring-[#18794e]/20"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg border border-[#dce6df] bg-[#eef3ef] p-1"
          role="group"
          aria-label="Filter kategori anggota"
        >
          {(
            [
              { id: 'all', label: 'Semua' },
              { id: 'Masyarakat umum', label: 'Masyarakat umum' },
              { id: 'Anak-anak', label: 'Anak-anak' },
              { id: 'Ibu hamil', label: 'Ibu hamil' },
              { id: 'Lansia', label: 'Lansia' },
            ] as const
          ).map((tab) => {
            const active = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
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
          <table className="w-full min-w-[660px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5ece7] bg-[#f8fbf9] text-xs font-semibold text-[#5a7064]">
                <th className="px-4 py-3">Nomor kartu</th>
                <th className="px-4 py-3">Nama anggota</th>
                <th className="px-4 py-3">Alamat</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status kartu</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ee] text-[13px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="mx-auto mb-2 h-6 w-6 text-[#8ba195]" />
                    <div className="text-sm font-medium text-[#3b5246]">
                      Belum ada anggota yang sesuai.
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenModal({ kind: 'member' })}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#18794e] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#13603e]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Daftarkan anggota</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((member) => {
                  const active = member.status === 'Aktif';
                  return (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-[#f9fcf9]"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[#162e23] tabular-nums">
                        {member.card}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#162e23]">
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-[#4a6255]">
                        {member.address || '-'}
                      </td>
                      <td className="px-4 py-3 text-[#354c40]">
                        {member.category}
                      </td>
                      <td className="px-4 py-3">
                        {active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18794e]">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b42318]">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>Nonaktif</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onToggleMemberStatus(member.id)}
                          className="rounded-lg border border-[#d6e2da] bg-white px-2.5 py-1.5 text-xs font-medium text-[#254033] transition-colors hover:bg-[#f4f8f5] whitespace-nowrap"
                        >
                          {active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
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
