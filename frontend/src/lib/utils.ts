import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function getRarityColor(rarity: string): string {
  const map: Record<string, string> = {
    Common: '#a09a8e',
    Uncommon: '#4ade80',
    Rare: '#60a5fa',
    'Rare Holo': '#a78bfa',
    'Ultra Rare': '#f97316',
    'Secret Rare': '#e5b13a',
  }
  return map[rarity] ?? '#a09a8e'
}

export function getConditionColor(condition: string): string {
  const map: Record<string, string> = {
    Mint: '#4ade80',
    'Near Mint': '#86efac',
    Excellent: '#60a5fa',
    Good: '#fbbf24',
    Poor: '#f87171',
  }
  return map[condition] ?? '#a09a8e'
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending_payment: '#fbbf24',
    paid: '#4ade80',
    processing: '#60a5fa',
    shipped: '#a78bfa',
    delivered: '#4ade80',
    cancelled: '#f87171',
    expired: '#6b7280',
  }
  return map[status] ?? '#a09a8e'
}

export function getStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
