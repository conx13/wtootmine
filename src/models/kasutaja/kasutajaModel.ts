export interface Kasutaja {
  id: number;
  enimi: string;
  pnimi: string;
  email: string;
  asutus: string;
  firma_id: number;
  asukoht: string;
  asukoht_id: number;
  mob: string;
  roll: string;
  markus?: string;
  pilt: string;
  todate?: string;
}

export interface Asukohad {
  id: number;
  nimi: string;
}
export interface Valikud {
  label: string;
  value: number;
}
