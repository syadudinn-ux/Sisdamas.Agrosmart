import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type {
  AgroDatabase,
  MemberCategory,
  MemberStatus,
  ModalType,
  TransactionType,
} from '../types';
import {
  computeTotalEggStock,
  computeVegStockByName,
  formatNumber,
  todayISO,
} from '../data/seedData';
import { Modal } from './Modal';

interface ModalsProps {
  modal: ModalType | null;
  db: AgroDatabase;
  onClose: () => void;
  onAddCrop: (data: {
    name: string;
    date: string;
    harvest: string;
    progress: number;
  }) => void;
  onUpdateCropProgress: (cropId: string, progress: number) => void;
  onAddEgg: (data: { date: string; qty: number; note: string }) => void;
  onUpdateHens: (hens: number) => void;
  onAddHarvest: (data: { name: string; qty: number; date: string }) => void;
  onAddMember: (data: {
    name: string;
    address: string;
    category: MemberCategory;
    card: string;
    status: MemberStatus;
  }) => void;
  onAddTransaction: (data: {
    type: TransactionType;
    card: string;
    person: string;
    category: MemberCategory;
    vegName: string;
    veg: number;
    egg: number;
    waste: number;
    date: string;
  }) => void;
  onResetDB: (mode: 'empty' | 'sample') => void;
}

const inputClass =
  'w-full rounded-lg border border-[#d6e2da] bg-white px-3 py-2 text-sm text-[#162e23] transition-colors focus:border-[#18794e] focus:outline-none focus:ring-2 focus:ring-[#18794e]/20';
const labelClass = 'block text-xs font-semibold text-[#3f574b] mb-1.5';

function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2 rounded-lg border border-[#f5c6c4] bg-[#fff5f5] px-3 py-2.5 text-xs font-medium text-[#b42318]"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export const Modals: React.FC<ModalsProps> = ({
  modal,
  db,
  onClose,
  onAddCrop,
  onUpdateCropProgress,
  onAddEgg,
  onUpdateHens,
  onAddHarvest,
  onAddMember,
  onAddTransaction,
  onResetDB,
}) => {
  const [error, setError] = useState('');

  // Crop state
  const [cropName, setCropName] = useState('');
  const [cropDate, setCropDate] = useState(todayISO());
  const [cropHarvest, setCropHarvest] = useState('');
  const [cropProgress, setCropProgress] = useState('0');

  // Edit progress state
  const [editProgressVal, setEditProgressVal] = useState(0);

  // Egg state
  const [eggDate, setEggDate] = useState(todayISO());
  const [eggQty, setEggQty] = useState('');
  const [eggNote, setEggNote] = useState('');

  // Hen state
  const [hensVal, setHensVal] = useState(String(db.hens));

  // Harvest state
  const [harvestName, setHarvestName] = useState('');
  const [harvestQty, setHarvestQty] = useState('');
  const [harvestDate, setHarvestDate] = useState(todayISO());

  // Member state
  const [memberName, setMemberName] = useState('');
  const [memberAddress, setMemberAddress] = useState('');
  const [memberCategory, setMemberCategory] =
    useState<MemberCategory>('Masyarakat umum');
  const [memberCard, setMemberCard] = useState('');
  const [memberStatus, setMemberStatus] = useState<MemberStatus>('Aktif');

  // Transaction state
  const [trxType, setTrxType] = useState<TransactionType>('Gratis');
  const [trxCard, setTrxCard] = useState('');
  const [trxPerson, setTrxPerson] = useState('');
  const [trxVegName, setTrxVegName] = useState('');
  const [trxVegQty, setTrxVegQty] = useState('0');
  const [trxEggQty, setTrxEggQty] = useState('0');
  const [trxWasteQty, setTrxWasteQty] = useState('0');
  const [trxDate, setTrxDate] = useState(todayISO());

  useEffect(() => {
    setError('');
    if (!modal) return;

    const today = todayISO();

    if (modal.kind === 'crop') {
      setCropName('');
      setCropDate(today);
      setCropHarvest('');
      setCropProgress('0');
    } else if (modal.kind === 'cropProgress') {
      const target = db.crops.find((c) => c.id === modal.cropId);
      setEditProgressVal(target ? target.progress : 0);
    } else if (modal.kind === 'egg') {
      setEggDate(today);
      setEggQty('');
      setEggNote('');
    } else if (modal.kind === 'hen') {
      setHensVal(String(db.hens));
    } else if (modal.kind === 'harvest') {
      setHarvestName(modal.prefillName || '');
      setHarvestQty('');
      setHarvestDate(today);
    } else if (modal.kind === 'member') {
      const nextNum = String(db.members.length + 1).padStart(3, '0');
      setMemberName('');
      setMemberAddress('');
      setMemberCategory('Masyarakat umum');
      setMemberCard(`AGM-${nextNum}`);
      setMemberStatus('Aktif');
    } else if (modal.kind === 'transaction') {
      setTrxType('Gratis');
      setTrxCard('');
      setTrxPerson('');
      const stockMap = computeVegStockByName(db);
      const firstAvailable = Object.entries(stockMap).find(([, q]) => q > 0);
      setTrxVegName(firstAvailable ? firstAvailable[0] : '');
      setTrxVegQty('0');
      setTrxEggQty('0');
      setTrxWasteQty('0');
      setTrxDate(today);
    }
  }, [modal, db]);

  if (!modal) return null;

  const vegStockMap = computeVegStockByName(db);
  const availableVegEntries = Object.entries(vegStockMap).filter(
    ([, qty]) => qty > 0
  );
  const eggStock = computeTotalEggStock(db);

  const handleCardSelectChange = (selectedCard: string) => {
    setTrxCard(selectedCard);
    const found = db.members.find(
      (m) => m.card.toLowerCase() === selectedCard.trim().toLowerCase()
    );
    if (found) {
      setTrxPerson(found.name);
      if (found.category === 'Masyarakat umum') {
        setTrxType('Barter');
      } else {
        setTrxType('Gratis');
        setTrxWasteQty('0');
      }
    }
  };

  if (modal.kind === 'crop') {
    return (
      <Modal
        open
        title="Tambah tanaman"
        subtitle="Catat komoditas baru yang sedang dibudidayakan di kebun."
        onClose={onClose}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const prog = Number(cropProgress);
            if (!cropName.trim()) {
              setError('Nama tanaman wajib diisi.');
              return;
            }
            if (!Number.isFinite(prog) || prog < 0 || prog > 100) {
              setError('Progres pertumbuhan harus antara 0 hingga 100%.');
              return;
            }
            onAddCrop({
              name: cropName.trim(),
              date: cropDate,
              harvest: cropHarvest,
              progress: Math.round(prog),
            });
            onClose();
          }}
        >
          <FormError message={error} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="crop-name">
                Nama tanaman *
              </label>
              <input
                id="crop-name"
                type="text"
                required
                placeholder="Contoh: Kangkung Organik"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="crop-date">
                Tanggal tanam *
              </label>
              <input
                id="crop-date"
                type="date"
                required
                value={cropDate}
                onChange={(e) => setCropDate(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="crop-harvest">
                Estimasi tanggal panen
              </label>
              <input
                id="crop-harvest"
                type="date"
                value={cropHarvest}
                onChange={(e) => setCropHarvest(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="crop-progress">
                Progres awal (%) *
              </label>
              <input
                id="crop-progress"
                type="number"
                min={0}
                max={100}
                required
                value={cropProgress}
                onChange={(e) => setCropProgress(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#18794e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13603e]"
            >
              Simpan data
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.kind === 'cropProgress') {
    const crop = db.crops.find((c) => c.id === modal.cropId);
    if (!crop) return null;
    return (
      <Modal
        open
        title="Ubah progres tanaman"
        subtitle={`Perbarui perkembangan budidaya ${crop.name}.`}
        onClose={onClose}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !Number.isFinite(editProgressVal) ||
              editProgressVal < 0 ||
              editProgressVal > 100
            ) {
              setError('Progres harus bernilai 0 sampai 100.');
              return;
            }
            onUpdateCropProgress(crop.id, Math.round(editProgressVal));
            onClose();
          }}
        >
          <FormError message={error} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#162e23]">
                {crop.name}
              </span>
              <span className="font-mono text-base font-bold text-[#18794e] tabular-nums">
                {editProgressVal}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={editProgressVal}
              onChange={(e) => setEditProgressVal(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[#18794e]"
            />
            <div>
              <label className={labelClass} htmlFor="edit-progress-input">
                Atau masukkan angka (0–100)
              </label>
              <input
                id="edit-progress-input"
                type="number"
                min={0}
                max={100}
                value={editProgressVal}
                onChange={(e) =>
                  setEditProgressVal(
                    Math.max(0, Math.min(100, Number(e.target.value || 0)))
                  )
                }
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#18794e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13603e]"
            >
              Simpan progres
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.kind === 'egg') {
    return (
      <Modal
        open
        title="Catat produksi telur"
        subtitle="Tambahkan hasil panen telur harian ke stok siap distribusi."
        onClose={onClose}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const qty = Number(eggQty);
            if (!Number.isFinite(qty) || qty <= 0) {
              setError('Jumlah telur harus lebih dari 0 butir.');
              return;
            }
            onAddEgg({
              date: eggDate,
              qty: Math.round(qty),
              note: eggNote.trim(),
            });
            onClose();
          }}
        >
          <FormError message={error} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="egg-date">
                Tanggal produksi *
              </label>
              <input
                id="egg-date"
                type="date"
                required
                value={eggDate}
                onChange={(e) => setEggDate(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="egg-qty">
                Jumlah telur (butir) *
              </label>
              <input
                id="egg-qty"
                type="number"
                min={1}
                required
                placeholder="Contoh: 42"
                value={eggQty}
                onChange={(e) => setEggQty(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="egg-note">
                Catatan kandang
              </label>
              <input
                id="egg-note"
                type="text"
                placeholder="Contoh: Kondisi pakan & kandang normal"
                value={eggNote}
                onChange={(e) => setEggNote(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#18794e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13603e]"
            >
              Simpan produksi
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.kind === 'hen') {
    return (
      <Modal
        open
        title="Atur populasi ayam"
        subtitle="Perbarui jumlah ayam petelur produktif saat ini."
        onClose={onClose}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const count = Number(hensVal);
            if (!Number.isFinite(count) || count < 0) {
              setError('Jumlah ayam tidak boleh negatif.');
              return;
            }
            onUpdateHens(Math.round(count));
            onClose();
          }}
        >
          <FormError message={error} />
          <div>
            <label className={labelClass} htmlFor="hen-count">
              Jumlah ayam petelur (ekor) *
            </label>
            <input
              id="hen-count"
              type="number"
              min={0}
              required
              value={hensVal}
              onChange={(e) => setHensVal(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#18794e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13603e]"
            >
              Simpan populasi
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.kind === 'harvest') {
    return (
      <Modal
        open
        title="Masukkan hasil panen ke stok"
        subtitle="Catat sayuran yang sudah dipanen agar tersedia untuk distribusi atau barter."
        onClose={onClose}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const qty = Number(harvestQty);
            if (!harvestName.trim()) {
              setError('Jenis sayuran wajib diisi.');
              return;
            }
            if (!Number.isFinite(qty) || qty <= 0) {
              setError('Jumlah panen harus lebih dari 0 kg.');
              return;
            }
            onAddHarvest({
              name: harvestName.trim(),
              qty,
              date: harvestDate,
            });
            onClose();
          }}
        >
          <FormError message={error} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="harvest-name">
                Jenis sayuran *
              </label>
              <input
                id="harvest-name"
                type="text"
                list="crop-suggestions"
                required
                placeholder="Contoh: Kangkung Organik"
                value={harvestName}
                onChange={(e) => setHarvestName(e.target.value)}
                className={inputClass}
              />
              <datalist id="crop-suggestions">
                {Array.from(
                  new Set([
                    ...db.crops.map((c) => c.name),
                    ...Object.keys(vegStockMap),
                  ])
                ).map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelClass} htmlFor="harvest-qty">
                Jumlah panen (kg) *
              </label>
              <input
                id="harvest-qty"
                type="number"
                step="0.1"
                min={0.1}
                required
                placeholder="Contoh: 12.5"
                value={harvestQty}
                onChange={(e) => setHarvestQty(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="harvest-date">
                Tanggal panen *
              </label>
              <input
                id="harvest-date"
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#18794e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13603e]"
            >
              Masukkan ke stok
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.kind === 'member') {
    return (
      <Modal
        open
        title="Daftarkan anggota program"
        subtitle="Setiap warga memperoleh nomor kartu unik sebagai syarat transaksi."
        onClose={onClose}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const cleanCard = memberCard.trim().toUpperCase();
            if (!memberName.trim() || !memberAddress.trim() || !cleanCard) {
              setError('Nama, alamat, dan nomor kartu wajib diisi.');
              return;
            }
            if (
              db.members.some(
                (m) => m.card.toLowerCase() === cleanCard.toLowerCase()
              )
            ) {
              setError('Nomor kartu sudah digunakan oleh anggota lain.');
              return;
            }
            onAddMember({
              name: memberName.trim(),
              address: memberAddress.trim(),
              category: memberCategory,
              card: cleanCard,
              status: memberStatus,
            });
            onClose();
          }}
        >
          <FormError message={error} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="member-name">
                Nama lengkap *
              </label>
              <input
                id="member-name"
                type="text"
                required
                placeholder="Nama warga"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="member-address">
                Alamat / RT *
              </label>
              <input
                id="member-address"
                type="text"
                required
                placeholder="Contoh: RT 02 / RW 01"
                value={memberAddress}
                onChange={(e) => setMemberAddress(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="member-category">
                Kategori anggota *
              </label>
              <select
                id="member-category"
                value={memberCategory}
                onChange={(e) =>
                  setMemberCategory(e.target.value as MemberCategory)
                }
                className={inputClass}
              >
                <option value="Masyarakat umum">Masyarakat umum</option>
                <option value="Anak-anak">Anak-anak</option>
                <option value="Ibu hamil">Ibu hamil</option>
                <option value="Lansia">Lansia</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="member-card">
                Nomor kartu program *
              </label>
              <input
                id="member-card"
                type="text"
                required
                value={memberCard}
                onChange={(e) => setMemberCard(e.target.value)}
                className={`${inputClass} font-mono uppercase`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="member-status">
                Status kartu *
              </label>
              <select
                id="member-status"
                value={memberStatus}
                onChange={(e) =>
                  setMemberStatus(e.target.value as MemberStatus)
                }
                className={inputClass}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#18794e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13603e]"
            >
              Simpan anggota
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.kind === 'transaction') {
    const matchedMember = db.members.find(
      (m) => m.card.toLowerCase() === trxCard.trim().toLowerCase()
    );

    return (
      <Modal
        open
        title="Catat distribusi atau barter"
        subtitle="Distribusi gratis untuk anak-anak, ibu hamil, & lansia. Barter organik untuk masyarakat umum."
        onClose={onClose}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const member = db.members.find(
              (m) =>
                m.card.toLowerCase() === trxCard.trim().toLowerCase() &&
                m.status === 'Aktif'
            );
            if (!member) {
              setError('Kartu anggota tidak ditemukan atau berstatus nonaktif.');
              return;
            }
            if (
              member.name.trim().toLowerCase() !==
              trxPerson.trim().toLowerCase()
            ) {
              setError('Nama penerima tidak sesuai dengan data pemegang kartu.');
              return;
            }

            const veg = Number(trxVegQty || 0);
            const egg = Number(trxEggQty || 0);
            const waste = Number(trxWasteQty || 0);

            if (
              !Number.isFinite(veg) ||
              !Number.isFinite(egg) ||
              !Number.isFinite(waste) ||
              veg < 0 ||
              egg < 0 ||
              waste < 0 ||
              (veg === 0 && egg === 0)
            ) {
              setError(
                'Masukkan jumlah sayuran atau telur yang valid (minimal salah satu lebih dari 0).'
              );
              return;
            }

            if (trxType === 'Barter' && waste <= 0) {
              setError(
                'Transaksi barter wajib mencatat berat sampah organik lebih dari 0 kg.'
              );
              return;
            }
            if (
              trxType === 'Gratis' &&
              !['Anak-anak', 'Ibu hamil', 'Lansia'].includes(member.category)
            ) {
              setError(
                'Distribusi gratis hanya untuk kategori Anak-anak, Ibu hamil, dan Lansia.'
              );
              return;
            }
            if (
              trxType === 'Barter' &&
              member.category !== 'Masyarakat umum'
            ) {
              setError(
                'Jalur barter diperuntukkan bagi kategori Masyarakat umum.'
              );
              return;
            }

            if (veg > 0) {
              if (!trxVegName.trim()) {
                setError('Pilih jenis sayuran yang akan disalurkan.');
                return;
              }
              const avail = Number(vegStockMap[trxVegName.trim()] || 0);
              if (avail < veg) {
                setError(
                  `Stok ${trxVegName.trim()} tidak mencukupi (tersedia ${formatNumber(
                    Math.max(0, avail)
                  )} kg).`
                );
                return;
              }
            }

            if (egg > eggStock) {
              setError(
                `Stok telur tidak mencukupi (tersedia ${formatNumber(
                  eggStock
                )} butir).`
              );
              return;
            }

            onAddTransaction({
              type: trxType,
              card: member.card,
              person: member.name,
              category: member.category,
              vegName: veg > 0 ? trxVegName.trim() : '',
              veg,
              egg: Math.round(egg),
              waste: trxType === 'Barter' ? waste : 0,
              date: trxDate,
            });
            onClose();
          }}
        >
          <FormError message={error} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="trx-type">
                Jenis transaksi *
              </label>
              <select
                id="trx-type"
                value={trxType}
                onChange={(e) =>
                  setTrxType(e.target.value as TransactionType)
                }
                className={inputClass}
              >
                <option value="Gratis">Gratis</option>
                <option value="Barter">Barter</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="trx-date">
                Tanggal transaksi *
              </label>
              <input
                id="trx-date"
                type="date"
                required
                value={trxDate}
                onChange={(e) => setTrxDate(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="trx-card">
                Nomor kartu program *
              </label>
              <input
                id="trx-card"
                type="text"
                list="member-cards-list"
                required
                placeholder="Contoh: AGM-001"
                value={trxCard}
                onChange={(e) => handleCardSelectChange(e.target.value)}
                className={`${inputClass} font-mono uppercase`}
              />
              <datalist id="member-cards-list">
                {db.members.map((m) => (
                  <option
                    key={m.id}
                    value={m.card}
                    label={`${m.name} (${m.category} · ${m.status})`}
                  />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelClass} htmlFor="trx-person">
                Nama penerima *
              </label>
              <input
                id="trx-person"
                type="text"
                required
                placeholder="Otomatis terisi dari nomor kartu"
                value={trxPerson}
                onChange={(e) => setTrxPerson(e.target.value)}
                className={inputClass}
              />
            </div>

            {matchedMember && (
              <div className="sm:col-span-2 rounded-lg border border-[#d9e8de] bg-[#f4faf6] px-3 py-2 text-xs text-[#254d39]">
                Pemegang kartu terdeteksi: <strong>{matchedMember.name}</strong>{' '}
                · {matchedMember.category} · Status kartu{' '}
                <strong>{matchedMember.status}</strong>
              </div>
            )}

            <div>
              <label className={labelClass} htmlFor="trx-veg-name">
                Jenis sayuran (jika ada)
              </label>
              <select
                id="trx-veg-name"
                value={trxVegName}
                onChange={(e) => setTrxVegName(e.target.value)}
                className={inputClass}
              >
                <option value="">-- Tidak ambil sayuran --</option>
                {availableVegEntries.map(([name, qty]) => (
                  <option key={name} value={name}>
                    {name} (stok {formatNumber(qty)} kg)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="trx-veg-qty">
                Sayuran keluar (kg)
              </label>
              <input
                id="trx-veg-qty"
                type="number"
                step="0.1"
                min={0}
                value={trxVegQty}
                onChange={(e) => setTrxVegQty(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="trx-egg-qty">
                Telur keluar (butir · stok {formatNumber(eggStock)})
              </label>
              <input
                id="trx-egg-qty"
                type="number"
                min={0}
                value={trxEggQty}
                onChange={(e) => setTrxEggQty(e.target.value)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="trx-waste-qty">
                Sampah organik masuk (kg)
              </label>
              <input
                id="trx-waste-qty"
                type="number"
                step="0.1"
                min={0}
                disabled={trxType === 'Gratis'}
                value={trxType === 'Gratis' ? '0' : trxWasteQty}
                onChange={(e) => setTrxWasteQty(e.target.value)}
                className={`${inputClass} tabular-nums disabled:bg-[#f3f6f4] disabled:text-[#7e9186]`}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#18794e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13603e]"
            >
              Simpan transaksi
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.kind === 'confirmReset') {
    const isEmpty = modal.mode === 'empty';
    return (
      <Modal
        open
        title={isEmpty ? 'Kosongkan seluruh data?' : 'Muat ulang data contoh?'}
        subtitle={
          isEmpty
            ? 'Semua catatan tanaman, stok, anggota, dan transaksi pada perangkat ini akan dihapus.'
            : 'Data saat ini akan diganti dengan data simulasi awal SISDAMAS AGROSMART.'
        }
        onClose={onClose}
      >
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#d6e2da] bg-white px-4 py-2 text-sm font-medium text-[#2c4337] hover:bg-[#f4f8f5]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onResetDB(modal.mode);
              onClose();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              isEmpty
                ? 'bg-[#b42318] hover:bg-[#911b12]'
                : 'bg-[#18794e] hover:bg-[#13603e]'
            }`}
          >
            {isEmpty ? 'Ya, kosongkan data' : 'Muat data contoh'}
          </button>
        </div>
      </Modal>
    );
  }

  return null;
};
