import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor
}

/**
 * Gmail compose URL. Opening this (in a new tab) drops the visitor straight into
 * Gmail's compose window, pre-addressed to NNK — instead of the OS default mail
 * client that a plain `mailto:` would launch.
 */
export function gmailCompose(subject?: string, body?: string) {
  let url = 'https://mail.google.com/mail/?view=cm&fs=1&to=thenameisnnk@gmail.com'
  if (subject) url += `&su=${encodeURIComponent(subject)}`
  if (body) url += `&body=${encodeURIComponent(body)}`
  return url
}
