import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
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
  const labels: Record<string, string> = {
    pending_payment: 'Menunggu Bayar',
    paid: 'Sudah Dibayar',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Diterima',
    cancelled: 'Dibatalkan',
    expired: 'Kedaluwarsa',
  }
  return labels[status] ?? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
