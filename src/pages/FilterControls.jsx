import React, { useState } from 'react';
import styled from 'styled-components';
import { categories } from '../constants/categories.js';

// Стили для контейнера фильтров
const FilterControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

// Стили для кнопок открытия модальных окон
const FilterButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #ffffff;
  color: ${props => (props.selected ? '#1FA46C' : '#333')};
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
  text-decoration: ${props => (props.selected ? 'underline' : 'none')};

  &:hover {
    background: #f4f5f6;
  }

  svg.arrow {
    margin-left: 6px;
    flex-shrink: 0;
  }
`;

// Стили для модального окна
const Modal = styled.div`
  position: absolute;
  top: 100%; /* Размещаем под кнопкой */
  left: 0; /* Выравниваем по левому краю кнопки */
  width: 176px;
  max-height: 240px;
  border: 0.5px solid #999999;
  border-radius: 6px;
  padding: 12px;
  gap: 10px;
  background: #ffffff;
  box-shadow: 0px 20px 67px -12px #00000021;
  opacity: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 1000;
`;

// Стили для элементов списка в модальном окне
const ModalItem = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 8px;
  border: none;
  background: ${props => (props.selected ? '#DBFFE9' : '#F4F5F6')};
  color: ${props => (props.selected ? '#1FA46C' : '#333')};
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  border-radius: 30px;
  transition: background 0.3s ease;
  text-decoration: none; /* Убрано подчеркивание для выбранных элементов */

  svg.icon {
    margin-right: 6px;
  }

  &:hover {
    background: #f4f5f6;
  }

  ${props =>
    props.selected &&
    `
      svg.icon path {
        fill: #1FA46C;
      }
    `}
`;

// Компонент стрелочки
const ArrowIcon = () => (
  <svg
    className="arrow"
    width="7"
    height="6"
    viewBox="0 0 7 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.5 5.5L0.468911 0.25L6.53109 0.25L3.5 5.5Z" fill="#1FA46C" />
  </svg>
);

const FilterControls = ({ filterCategory, setFilterCategory, sortBy, setSortBy }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const sortOptions = [
    { display: 'Без сортировки', value: '' },
    { display: 'По дате', value: 'date' },
    { display: 'По сумме', value: 'sum' },
  ];

  const handleFilterSelect = (value) => {
    setFilterCategory(value);
    setIsFilterModalOpen(false);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setIsSortModalOpen(false);
  };

  return (
    <FilterControlsWrapper>
      <div style={{ position: 'relative' }}>
        <FilterButton
          selected={filterCategory !== ''}
          onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
        >
          Фильтровать по: {categories.find(cat => cat.value === filterCategory)?.label || 'Все категории'}
          {filterCategory !== '' && <ArrowIcon />}
        </FilterButton>
        {isFilterModalOpen && (
          <Modal>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <ModalItem
                  key={category.value}
                  selected={filterCategory === category.value}
                  onClick={() => handleFilterSelect(category.value)}
                >
                  {IconComponent && <IconComponent className="icon" />}
                  {category.label}
                </ModalItem>
              );
            })}
          </Modal>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <FilterButton
          selected={sortBy !== ''}
          onClick={() => setIsSortModalOpen(!isSortModalOpen)}
        >
          Сортировать по: {sortOptions.find(opt => opt.value === sortBy)?.display || 'Без сортировки'}
          {sortBy !== '' && <ArrowIcon />}
        </FilterButton>
        {isSortModalOpen && (
          <Modal>
            {sortOptions.map((option) => (
              <ModalItem
                key={option.value}
                selected={sortBy === option.value}
                onClick={() => handleSortSelect(option.value)}
              >
                {option.display}
              </ModalItem>
            ))}
          </Modal>
        )}
      </div>
    </FilterControlsWrapper>
  );
};

export default FilterControls;