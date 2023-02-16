import { Ledger } from '@/ui/store/types';

export const emptyState = {
  address: undefined,
  balance: null,
  transactions: null,
  error: null,
  loading: false,
};
export const ledger: Ledger = { ...emptyState };
