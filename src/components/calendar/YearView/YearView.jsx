import React from 'react';
import styled from 'styled-components';
import { MONTH_NAMES } from '../constants/constant.js';
import { isMonthInRange } from '../dateUtils.js';

/**
 * Годовой календарь: сетка месяцев для выбора диапазона
 * years — массив годов (например, [2024, 2025])
 * startMonth/endMonth — выбранный диапазон месяцев ('YYYY-MM')
 * onMonthClick — обработчик клика по месяцу
 */
function YearView({ years, startMonth, endMonth, onMonthClick }) {
  // Проверяет, выбран ли месяц
  function isSelected(year, month) {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    return key === startMonth || key === endMonth;
  }

  return (
    <ScrollContainer>
      {years.map(year => (
        <YearBlock key={year}>
          <YearHeader>{year}</YearHeader>
          <MonthsGrid>
            {MONTH_NAMES.map((name, idx) => {
              const monthNum = idx + 1;
              const selected = isSelected(year, monthNum);
              const inRange = isMonthInRange(year, monthNum, startMonth, endMonth);
              return (
                <MonthCell
                  key={`${year}-${monthNum}`}
                  $isSelected={selected}
                  $isInRange={inRange}
                  onClick={() => onMonthClick(year, monthNum)}
                >
                  {name}
                </MonthCell>
              );
            })}
          </MonthsGrid>
        </YearBlock>
      ))}
    </ScrollContainer>
  );
}

// --- Стили ---
const ScrollContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  
  @media (max-width: 768px) {
    padding-bottom: 16px;
  }
`;

const YearBlock = styled.div`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const YearHeader = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const MonthCell = styled.div`
  background: ${({ $isSelected, $isInRange }) =>
    $isSelected ? '#CFF8E2' :
    $isInRange ? '#EAF9F1' : '#F1F1F1'};
  color: ${({ $isSelected }) => ($isSelected ? '#24A148' : '#000')};
  border-radius: 999px;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #E0F2E8;
    color: #24A148;
  }
  
  @media (max-width: 768px) {
    padding: 8px 0;
    font-size: 13px;
  }
`;

export default YearView;