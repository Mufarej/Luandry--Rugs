import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} EGP`
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = { PENDING: 'Pending', PICKED_UP: 'Picked Up', IN_WASHING: 'Washing', IN_IRONING: 'Ironing', IN_PACKAGING: 'Packaging', READY: 'Ready', OUT_FOR_DELIVERY: 'Out For Delivery', COMPLETED: 'Completed', CANCELLED: 'Cancelled' }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-800', PICKED_UP: 'bg-blue-100 text-blue-800', IN_WASHING: 'bg-cyan-100 text-cyan-800', IN_IRONING: 'bg-purple-100 text-purple-800', IN_PACKAGING: 'bg-pink-100 text-pink-800', READY: 'bg-green-100 text-green-800', OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800', COMPLETED: 'bg-emerald-100 text-emerald-800', CANCELLED: 'bg-red-100 text-red-800' }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
