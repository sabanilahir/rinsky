import { Order, SnackMenuItem } from '../types/order';
import { INITIAL_PRICELIST } from '../data/initialPricelist';
import { SAMPLE_ORDERS } from '../data/sampleOrders';

const ORDERS_KEY = 'rinsky_orders_v1';
const PRICELIST_KEY = 'rinsky_pricelist_v1';
const KITCHEN_CHECKS_KEY = 'rinsky_kitchen_checks_v1';

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load orders from localStorage:', err);
    return SAMPLE_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage:', err);
  }
}

export function getStoredPricelist(): SnackMenuItem[] {
  try {
    const raw = localStorage.getItem(PRICELIST_KEY);
    if (!raw) {
      localStorage.setItem(PRICELIST_KEY, JSON.stringify(INITIAL_PRICELIST));
      return INITIAL_PRICELIST;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load pricelist from localStorage:', err);
    return INITIAL_PRICELIST;
  }
}

export function saveStoredPricelist(list: SnackMenuItem[]): void {
  try {
    localStorage.setItem(PRICELIST_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save pricelist to localStorage:', err);
  }
}

export function getStoredKitchenChecks(date: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(`${KITCHEN_CHECKS_KEY}_${date}`);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

export function saveStoredKitchenChecks(date: string, checks: Record<string, boolean>): void {
  try {
    localStorage.setItem(`${KITCHEN_CHECKS_KEY}_${date}`, JSON.stringify(checks));
  } catch (err) {
    console.error('Failed to save kitchen checks:', err);
  }
}

export function resetAllData(): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(SAMPLE_ORDERS));
  localStorage.setItem(PRICELIST_KEY, JSON.stringify(INITIAL_PRICELIST));
}
