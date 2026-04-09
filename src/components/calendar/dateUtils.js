import { MONTH_NAMES, MONTH_NAMES_GENITIVE } from './constants/constant.js';

// Преобразует дату (строкой или Date) в формат '5 июля 2024'
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();
  return `${day} ${MONTH_NAMES_GENITIVE[month]} ${year}`;
}

// Преобразует ключ месяца '2024-07' в 'Июль 2024'
export function formatMonth(monthKey) {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

// Проверяет, входит ли дата в диапазон (включительно)
export function isDateInRange(date, start, end) {
  if (!start || !end) return false;
  const d = new Date(date);
  return d >= new Date(start) && d <= new Date(end);
}

// Проверяет, входит ли месяц (год+месяц) в диапазон месяцев
export function isMonthInRange(year, month, startMonth, endMonth) {
  if (!startMonth || !endMonth) return false;
  const mKey = `${year}-${String(month).padStart(2, '0')}`;
  return mKey >= startMonth && mKey <= endMonth;
}

// Форматирует дату в 'месяц-день-год' (например, '12-1-2024')
export function formatMDY(date) {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}