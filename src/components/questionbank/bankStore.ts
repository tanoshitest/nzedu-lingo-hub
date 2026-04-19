import { useSyncExternalStore } from 'react';
import { type BankItem, bankItems as seed } from '@/data/mockQuestionBank';

// Simple module-level store so AdminQuestionBank and ImportFromBankDialog stay in sync
// across screens during a session (no persistence — mock only).

let items: BankItem[] = [...seed];
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

export const bankStore = {
  getAll(): BankItem[] {
    return items;
  },
  upsert(item: BankItem) {
    items = items.some((x) => x.id === item.id)
      ? items.map((x) => (x.id === item.id ? item : x))
      : [...items, item];
    notify();
  },
  remove(id: string) {
    items = items.filter((x) => x.id !== id);
    notify();
  },
  incrementUsage(id: string) {
    items = items.map((x) => (x.id === id ? { ...x, usageCount: x.usageCount + 1 } : x));
    notify();
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  },
};

export const useBankItems = (): BankItem[] =>
  useSyncExternalStore(
    (cb) => bankStore.subscribe(cb),
    () => bankStore.getAll(),
    () => bankStore.getAll(),
  );
