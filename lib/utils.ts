import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyINRShort(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-emerald-600 bg-emerald-50";
  if (rating >= 4.0) return "text-green-600 bg-green-50";
  if (rating >= 3.5) return "text-yellow-600 bg-yellow-50";
  if (rating >= 3.0) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
}

export function getRatingBarColor(rating: number): string {
  if (rating >= 4.5) return "bg-emerald-500";
  if (rating >= 4.0) return "bg-green-500";
  if (rating >= 3.5) return "bg-yellow-500";
  if (rating >= 3.0) return "bg-orange-500";
  return "bg-red-500";
}

export function getRatingText(rating: number): string {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3.0) return "Good";
  if (rating >= 2.5) return "Average";
  return "Below Average";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
