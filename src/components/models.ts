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

export interface User {
  id: number;
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

export const enum messValik {
  'positive',
  'negative',
}
