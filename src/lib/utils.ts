import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTokenFromCookies(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  return cookie ? cookie.split("=")[1] : null;
}

export function formatDate(utcDateString: string): string {
  const date = new Date(utcDateString);
  // Convert to WIB by adding 7 hours
  const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const day = String(wibDate.getDate()).padStart(2, "0");
  const month = String(wibDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = wibDate.getFullYear();

  const hours = String(wibDate.getHours()).padStart(2, "0");
  const minutes = String(wibDate.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}