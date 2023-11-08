export interface Todo {
  id: number;
  content: string;
  kokku: number;
}

export interface Meta {
  totalCount: number;
}

export interface loginData {
  email: string;
  password: string;
}

export interface Kasutaja {
  tid: number;
  enimi: string;
  pnimi: string;
  email: string;
  firma: string;
  mob: string;
  roll: string;
  markus?: string;
  pilt: string;
  todate?: string;
}

//Kasutame kui vaja otse baasist töötajat
export interface Tootaja {
  TID: number;
  ENIMI: string;
  PNIMI: string;
  email: string;
  pilt: string;
  IKOOD: string;
  AJAGUPP: string;
  toogrupp_nimi: string;
  toogrupp_id: number;
  telefon: string;
  Ajanimi: string;
  firma: string;
  firma_id: number;
  asukoht: string;
  asukoht_id: number;
  Aktiivne: string;
}

export const enum messValik {
  'positive',
  'negative',
}
