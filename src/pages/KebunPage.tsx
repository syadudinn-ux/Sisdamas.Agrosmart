import React from 'react';
import { CheckCircle2, Clock, Info, Plus, SlidersHorizontal, Sprout } from 'lucide-react';
import type { AgroDatabase, ModalType } from '../types';

interface KebunPageProps {
  db: AgroDatabase;
  onOpenModal: (modal: ModalType) => void;
}

export const KebunPage: React.FC<KebunPageProps> = ({ db, onOpenModal }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#162e23] sm:text-[26px]">
            Kebun Sayur
          </h1>
          <p className="mt-1 text-sm text-[#566d60]">
            Catat tanggal tanam, estimasi panen, dan perkembangan tanaman.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal({ kind: 'crop' })}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18794e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13603e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah tanaman</span>
        </button>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-[#dcebe1] bg-[#f4faf6] px-4 py-3 text-xs leading-relaxed text-[#254d39]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#18794e]" />
        <span>
          Progres tanaman merupakan pemantauan budidaya. Hasil panen yang sudah
          siap harus dicatat terpisah ke stok pangan.
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#dfe8e2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5ece7] bg-[#f8fbf9] text-xs font-semibold text-[#5a7064]">
                <th className="px-4 py-3">Tanaman</th>
                <th className="px-4 py-3">Tanggal tanam</th>
                <th className="px-4 py-3">Estimasi panen</th>
                <th className="px-4 py-3">Progres</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ee] text-[13px]">
              {db.crops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Sprout className="mx-auto mb-2 h-6 w-6 text-[#8ba195]" />
                    <div className="text-sm font-medium text-[#3b5246]">
                      Belum ada tanaman terdaftar.
                    </div>
                    <p className="mt-1 text-xs text-[#657b6f]">
                      Tambahkan tanaman yang sedang ditanam di kebun komunitas.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenModal({ kind: 'crop' })}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#18794e] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#13603e]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah tanaman pertama</span>
                    </button>
                  </td>
                </tr>
              ) : (
                db.crops.map((crop) => {
                  const pct = Math.min(100, Math.max(0, crop.progress));
                  const ready = pct >= 100;
                  return (
                    <tr
                      key={crop.id}
                      className="transition-colors hover:bg-[#f9fcf9]"
                    >
                      <td className="px-4 py-3 font-semibold text-[#162e23]">
                        {crop.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#4a6255] tabular-nums">
                        {crop.date}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#4a6255] tabular-nums">
                        {crop.harvest || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex min-w-[120px] items-center gap-2.5">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9f0eb]">
                            <div
                              className="h-full rounded-full bg-[#229765]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-9 text-right font-mono text-xs font-semibold text-[#162e23] tabular-nums">
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {ready ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18794e]">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>Siap dipanen</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a96913]">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span>Dalam perawatan</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {ready && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenModal({
                                  kind: 'harvest',
                                  prefillName: crop.name,
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-[#cce4d5] bg-[#eaf6ef] px-2.5 py-1.5 text-xs font-semibold text-[#18794e] transition-colors hover:bg-[#daf0e3] whitespace-nowrap"
                            >
                              <span>Catat panen</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              onOpenModal({
                                kind: 'cropProgress',
                                cropId: crop.id,
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6e2da] bg-white px-2.5 py-1.5 text-xs font-medium text-[#254033] transition-colors hover:bg-[#f4f8f5] whitespace-nowrap"
                          >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            <span>Ubah progres</span>
                          </button>
                        </div>
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
