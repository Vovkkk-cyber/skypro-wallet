import React from 'react';
import styled from 'styled-components';
import { DayCell, EmptyDayCell } from '../DayCell.styled.js';
import { WEEKDAYS_SHORT } from '../constants/constant.js';
import { WeekdaysHeader, Weekday } from '../Calendar.styled';

/**
 * Месячный календарь: сетка дней с возможностью выбрать диапазон
 * month — номер месяца (1-12), year — год, title — заголовок (например, 'Июль 2024')
 * startDate/endDate — выбранный диапазон дат (строки 'YYYY-MM-DD')
 * onDayClick — обработчик клика по дню
 */
function MonthView({ month, year, title, startDate, endDate, onDayClick }) {
  // Сколько дней в этом месяце
  const daysInMonth = new Date(year, month, 0).getDate();
  // День недели первого числа (1 — понедельник, 7 — воскресенье)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay() || 7;

  // Проверяет, выбран ли этот день
  function isSelected(dateStr) {
    return dateStr === startDate || dateStr === endDate;
  }

  // Проверяет, входит ли день в выбранный диапазон
  function isInRange(dateStr) {
    if (startDate && endDate) {
      const d = new Date(dateStr);
      return d >= new Date(startDate) && d <= new Date(endDate);
    }
    return false;
  }

  return (
    <MonthContainer>
      <MonthHeader>{title}</MonthHeader>
      <DaysGrid>
        {/* Пустые ячейки для выравнивания начала месяца */}
        {Array.from({ length: firstDayOfWeek - 1 }).map((_, i) => (
          <EmptyDayCell key={`empty-${i}`} />
        ))}
        {/* Дни месяца */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          return (
            <DayCell
              key={dateStr}
              $isSelected={isSelected(dateStr)}
              $isInRange={isInRange(dateStr)}
              onClick={() => onDayClick(dateStr)}
            >
              {day}
            </DayCell>
          );
        })}
      </DaysGrid>
    </MonthContainer>
  );
}

// --- Стили ---
const MonthContainer = styled.div`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const MonthHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

export default MonthView;