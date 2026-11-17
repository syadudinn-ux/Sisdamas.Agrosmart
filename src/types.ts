export type PageId =
  | 'dashboard'
  | 'kebun'
  | 'ternak'
  | 'stok'
  | 'distribusi'
  | 'warga'
  | 'laporan';

export type MemberCategory =
  | 'Masyarakat umum'
  | 'Anak-anak'
  | 'Ibu hamil'
  | 'Lansia';

export type MemberStatus = 'Aktif' | 'Nonaktif';

export type TransactionType = 'Gratis' | 'Barter';

export interface CropItem {
  id: string;
  name: string;
  date: string;
  harvest: string;
  progress: number;
}

export interface EggRecord {
  id: string;
  date: string;
  qty: number;
  note: string;
}

export interface VegHarvestRecord {
  id: string;
  name: string;
  qty: number;
  date: string;
}

export interface MemberItem {
  id: string;
  name: string;
  address: string;
  category: MemberCategory;
  card: string;
  status: MemberStatus;
}

export interface TransactionItem {
  id: string;
  type: TransactionType;
  card: string;
  person: string;
  category: MemberCategory;
  vegName: string;
  veg: number;
  egg: number;
  waste: number;
  date: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  date: string;
}

export interface AgroDatabase {
  crops: CropItem[];
  members: MemberItem[];
  veg: VegHarvestRecord[];
  eggs: EggRecord[];
  transactions: TransactionItem[];
  hens: number;
  activities: ActivityItem[];
}

export type ModalType =
  | { kind: 'crop' }
  | { kind: 'cropProgress'; cropId: string }
  | { kind: 'egg' }
  | { kind: 'hen' }
  | { kind: 'harvest'; prefillName?: string }
  | { kind: 'member' }
  | { kind: 'transaction' }
  | { kind: 'confirmReset'; mode: 'empty' | 'sample' };
