import dayjs from 'dayjs';

export function lastNDays(count: number): string[] {
  return Array.from({ length: count }, (_, index) => dayjs().subtract(count - index - 1, 'day').format('YYYY-MM-DD'));
}

export function today(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function displayDate(value: string): string {
  return dayjs(value).format('MM月DD日');
}

