import type { AgroDatabase } from '../types';

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function daysAheadISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatNumber(n: number): string {
  return Number(n || 0).toLocaleString('id-ID', {
    maximumFractionDigits: 2,
  });
}

export function formatTodayLong(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const EMPTY_DB: AgroDatabase = {
  crops: [],
  members: [],
  veg: [],
  eggs: [],
  transactions: [],
  hens: 0,
  activities: [],
};

export function createSampleDB(): AgroDatabase {
  const today = todayISO();
  return {
    hens: 48,
    crops: [
      {
        id: 'crop-1',
        name: 'Kangkung Organik',
        date: daysAgoISO(22),
        harvest: daysAheadISO(2),
        progress: 95,
      },
      {
        id: 'crop-2',
        name: 'Bayam Merah',
        date: daysAgoISO(18),
        harvest: daysAheadISO(5),
        progress: 80,
      },
      {
        id: 'crop-3',
        name: 'Sawi Hijau (Caisim)',
        date: daysAgoISO(26),
        harvest: today,
        progress: 100,
      },
      {
        id: 'crop-4',
        name: 'Tomat Ceri',
        date: daysAgoISO(30),
        harvest: daysAheadISO(14),
        progress: 65,
      },
      {
        id: 'crop-5',
        name: 'Cabai Rawit',
        date: daysAgoISO(14),
        harvest: daysAheadISO(35),
        progress: 35,
      },
    ],
    veg: [
      { id: 'veg-1', name: 'Kangkung Organik', qty: 18.5, date: daysAgoISO(2) },
      { id: 'veg-2', name: 'Bayam Merah', qty: 12, date: daysAgoISO(1) },
      { id: 'veg-3', name: 'Sawi Hijau', qty: 15, date: today },
      { id: 'veg-4', name: 'Pakcoy', qty: 9.5, date: daysAgoISO(3) },
    ],
    eggs: [
      {
        id: 'egg-1',
        date: daysAgoISO(2),
        qty: 38,
        note: 'Kandang A & B kondisi normal',
      },
      {
        id: 'egg-2',
        date: daysAgoISO(1),
        qty: 41,
        note: 'Tambahan pakan dedak fermentasi',
      },
      {
        id: 'egg-3',
        date: today,
        qty: 43,
        note: 'Panen pagi hari',
      },
    ],
    members: [
      {
        id: 'mem-1',
        card: 'AGM-001',
        name: 'Siti Aminah',
        address: 'RT 02 / RW 01',
        category: 'Ibu hamil',
        status: 'Aktif',
      },
      {
        id: 'mem-2',
        card: 'AGM-002',
        name: 'Hendra Wijaya',
        address: 'RT 03 / RW 01',
        category: 'Masyarakat umum',
        status: 'Aktif',
      },
      {
        id: 'mem-3',
        card: 'AGM-003',
        name: 'Mbah Kartini',
        address: 'RT 01 / RW 02',
        category: 'Lansia',
        status: 'Aktif',
      },
      {
        id: 'mem-4',
        card: 'AGM-004',
        name: 'Raka Pratama',
        address: 'RT 04 / RW 02',
        category: 'Anak-anak',
        status: 'Aktif',
      },
      {
        id: 'mem-5',
        card: 'AGM-005',
        name: 'Dewi Lestari',
        address: 'RT 02 / RW 03',
        category: 'Masyarakat umum',
        status: 'Aktif',
      },
      {
        id: 'mem-6',
        card: 'AGM-006',
        name: 'Budi Santoso',
        address: 'RT 05 / RW 01',
        category: 'Masyarakat umum',
        status: 'Nonaktif',
      },
    ],
    transactions: [
      {
        id: 'trx-1',
        date: daysAgoISO(2),
        type: 'Gratis',
        card: 'AGM-001',
        person: 'Siti Aminah',
        category: 'Ibu hamil',
        vegName: 'Bayam Merah',
        veg: 1.5,
        egg: 6,
        waste: 0,
      },
      {
        id: 'trx-2',
        date: daysAgoISO(1),
        type: 'Barter',
        card: 'AGM-002',
        person: 'Hendra Wijaya',
        category: 'Masyarakat umum',
        vegName: 'Kangkung Organik',
        veg: 2,
        egg: 4,
        waste: 3.5,
      },
      {
        id: 'trx-3',
        date: daysAgoISO(1),
        type: 'Gratis',
        card: 'AGM-003',
        person: 'Mbah Kartini',
        category: 'Lansia',
        vegName: 'Sawi Hijau',
        veg: 1.5,
        egg: 6,
        waste: 0,
      },
      {
        id: 'trx-4',
        date: today,
        type: 'Barter',
        card: 'AGM-005',
        person: 'Dewi Lestari',
        category: 'Masyarakat umum',
        vegName: 'Pakcoy',
        veg: 2.5,
        egg: 5,
        waste: 4.2,
      },
    ],
    activities: [
      {
        id: 'act-1',
        text: 'Barter untuk Dewi Lestari berhasil dicatat',
        date: `${today}, 09:15`,
      },
      {
        id: 'act-2',
        text: 'Produksi telur dicatat: 43 butir',
        date: `${today}, 07:30`,
      },
      {
        id: 'act-3',
        text: 'Hasil panen Sawi Hijau sebanyak 15 kg masuk stok',
        date: `${today}, 06:45`,
      },
      {
        id: 'act-4',
        text: 'Distribusi gratis untuk Mbah Kartini berhasil dicatat',
        date: `${daysAgoISO(1)}, 16:10`,
      },
      {
        id: 'act-5',
        text: 'Barter untuk Hendra Wijaya berhasil dicatat',
        date: `${daysAgoISO(1)}, 10:20`,
      },
    ],
  };
}

export function computeVegStockByName(db: AgroDatabase): Record<string, number> {
  const map: Record<string, number> = {};
  for (const item of db.veg) {
    map[item.name] = (map[item.name] || 0) + Number(item.qty || 0);
  }
  for (const trx of db.transactions) {
    if (trx.vegName && trx.veg) {
      map[trx.vegName] = (map[trx.vegName] || 0) - Number(trx.veg || 0);
    }
  }
  return map;
}

export function computeTotalVegHarvested(db: AgroDatabase): number {
  return db.veg.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

export function computeTotalVegOut(db: AgroDatabase): number {
  return db.transactions.reduce((sum, trx) => sum + Number(trx.veg || 0), 0);
}

export function computeTotalVegStock(db: AgroDatabase): number {
  return Math.max(0, computeTotalVegHarvested(db) - computeTotalVegOut(db));
}

export function computeTotalEggProduced(db: AgroDatabase): number {
  return db.eggs.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

export function computeTotalEggOut(db: AgroDatabase): number {
  return db.transactions.reduce((sum, trx) => sum + Number(trx.egg || 0), 0);
}

export function computeTotalEggStock(db: AgroDatabase): number {
  return Math.max(0, computeTotalEggProduced(db) - computeTotalEggOut(db));
}
