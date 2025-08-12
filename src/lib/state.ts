import { create } from "zustand";

export interface Account {
  username?: string;
  oauth: string;
}
export interface Proxy {
  user?: string;
  pass?: string;
  ip: string;
  port: string;
}
interface AppState {
  accounts: Account[];
  proxies: Proxy[];
  setAccounts: (a: Account[]) => void;
  setProxies: (p: Proxy[]) => void;
}

export const useAppState = create<AppState>((set) => ({
  accounts: [],
  proxies: [],
  setAccounts: (accounts) => set({ accounts }),
  setProxies: (proxies) => set({ proxies }),
}));
