/**
 * Kenyan Geographical Data and Localization Utilities
 */

export const KENYA_COUNTIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Uasin Gishu',
  'Kiambu',
  'Machakos',
  'Kilifi',
  'Kajiado',
  'Nyeri',
  'Kisii',
  'Kakamega',
  'Kericho',
  'Meru',
  'Garissa',
  'Trans Nzoia',
  'Embu',
  'Bungoma',
  'Busia',
  'Homa Bay',
  'Migori',
  'Kitui',
  'Makueni',
  'Laikipia',
  'Lamu',
  'Turkana',
  'Isiolo',
  'Marsabit',
  'Mandera',
  'Wajir',
  'Taita Taveta',
  'Kwale',
  'Tana River',
  'Samburu',
  'Baringo',
  'West Pokot',
  'Elgeyo Marakwet',
  'Nandi',
  'Bomet',
  'Vihiga',
  'Siaya',
  'Nyamira',
  'Tharaka-Nithi',
  'Murang\'a',
  'Kirinyaga',
  'Nyandarua',
  'Narok'
];

export const KENYA_MAJOR_TOWNS = [
  'Nairobi CBD',
  'Westlands, Nairobi',
  'Upper Hill, Nairobi',
  'Kilimani, Nairobi',
  'Industrial Area, Nairobi',
  'Eastleigh, Nairobi',
  'Karen, Nairobi',
  'Thika, Kiambu',
  'Ruiru, Kiambu',
  'Kikuyu, Kiambu',
  'Mombasa Island',
  'Nyali, Mombasa',
  'Bamburi, Mombasa',
  'Diani, Kwale',
  'Malindi, Kilifi',
  'Watamu, Kilifi',
  'Nakuru Town',
  'Naivasha, Nakuru',
  'Kisumu Central',
  'Eldoret CBD, Uasin Gishu',
  'Kitale, Trans Nzoia',
  'Kitengela, Kajiado',
  'Ongata Rongai, Kajiado',
  'Machakos Town',
  'Nyeri Town',
  'Nanyuki, Laikipia',
  'Meru Town',
  'Kakamega Town',
  'Kisii Town',
  'Kericho Town',
  'Garissa Town',
  'Embu Town'
];

export const ALL_KENYA_LOCATIONS = [
  ...KENYA_MAJOR_TOWNS,
  ...KENYA_COUNTIES.map(c => `${c} County`)
];

export function searchKenyanLocations(query: string): string[] {
  if (!query || query.trim().length === 0) return ALL_KENYA_LOCATIONS.slice(0, 10);
  const q = query.toLowerCase().trim();
  return ALL_KENYA_LOCATIONS.filter(loc => loc.toLowerCase().includes(q)).slice(0, 8);
}

/**
 * Returns current date in Africa/Nairobi (UTC+3) formatted as YYYY-MM-DD
 */
export function getNairobiTodayString(): string {
  const now = new Date();
  // Africa/Nairobi is UTC+3
  const nairobiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
  const y = nairobiTime.getFullYear();
  const m = String(nairobiTime.getMonth() + 1).padStart(2, '0');
  const d = String(nairobiTime.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Checks if a job is OPEN according to the rule:
 * A job is OPEN when its status is 'open' AND it has no deadline OR today (Africa/Nairobi time) is on or before the deadline.
 */
export function isJobCurrentlyOpen(status: 'open' | 'closed', deadline?: string): boolean {
  if (status !== 'open') return false;
  if (!deadline) return true;
  const today = getNairobiTodayString();
  return today <= deadline;
}

/**
 * Formats currency to Kenya Shillings (KSh)
 */
export function formatKSh(amount: number | string | undefined): string {
  if (amount === undefined || amount === null || amount === '') return 'Negotiable';
  if (typeof amount === 'string') {
    if (amount.toUpperCase().includes('KSH')) return amount;
    const num = Number(amount.replace(/[^0-9.]/g, ''));
    if (!isNaN(num) && num > 0) {
      return `KSh ${num.toLocaleString('en-KE')}`;
    }
    return `KSh ${amount}`;
  }
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

/**
 * Formats dates for Kenyan users (e.g. 24 Oct 2026, Africa/Nairobi)
 */
export function formatNairobiDate(isoDateString?: string): string {
  if (!isoDateString) return 'No deadline';
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return isoDateString;
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Nairobi',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return isoDateString;
  }
}
