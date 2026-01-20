/**
 * Sanitizes a phone number to a standard 10-digit numeric format.
 * Removes any non-numeric characters and strips the leading zero if present.
 * 
 * @param phone The raw phone number string
 * @returns A clean 10-digit phone string
 */
export function sanitizePhone(phone: string): string {
    if (!phone) return ''

    // 1. Remove all non-numeric characters
    const numeric = phone.replace(/\D/g, '')

    // 2. Remove leading zero if it exists (standardize to 10 digits)
    const withoutLeadingZero = numeric.startsWith('0') ? numeric.slice(1) : numeric

    // 3. Take only the first 10 digits to prevent overflow/invalid data
    return withoutLeadingZero.slice(0, 10)
}

/**
 * Validates if a phone number is a valid 10-digit numeric string.
 * @param phone The cleaned phone number
 */
export function isValidPhone(phone: string): boolean {
    return /^\d{10}$/.test(phone)
}

/**
 * Formats a 10-digit phone number for display (e.g. 123-456-7890)
 */
export function formatPhoneDisplay(phone: string): string {
    const clean = sanitizePhone(phone)
    if (clean.length !== 10) return phone
    return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`
}
