import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from '../calendar/Calendar';
import Button from '../buttons/Button';

const PeriodSelectionContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    padding: 20px;
  }
`;

const PeriodSelectionModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #000;
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  flex: 1;
  text-align: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const SubHeader = styled.div`
  padding: 0 20px;
  margin-bottom: 20px;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const MainTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CalendarContainer = styled.div`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  padding: 20px;
`;

const SelectButton = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: none;
  background: #24A148;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #1e8a3e;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

/**
 * Компонент выбора периода для мобильных устройств
 * Показывается как модальное окно поверх основного контента
 */
const PeriodSelection = ({ 
  isOpen, 
  onClose, 
  onPeriodSelect, 
  onTransactionsChange, 
  onError,
  expenses 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleTransactionsChange = (transactions) => {
    console.log('PeriodSelection: received transactions:', transactions);
    setSelectedTransactions(transactions);
    // Также передаем транзакции в родительский компонент
    onTransactionsChange(transactions);
  };

  const handleSelect = () => {
    if (selectedPeriod) {
      onPeriodSelect(selectedPeriod);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedPeriod('');
    setSelectedTransactions([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <PeriodSelectionContainer>
      <PeriodSelectionModal>
        <ModalHeader>
          <BackButton onClick={handleCancel}>
            ← Анализ расходов
          </BackButton>
          <ModalTitle>Skypro.Wallet</ModalTitle>
          <CloseButton onClick={handleCancel}>Выйти</CloseButton>
        </ModalHeader>
        
        <SubHeader>
          <SubTitle>
            ← Анализ расходов
          </SubTitle>
          <MainTitle>Выбор периода</MainTitle>
        </SubHeader>
        
        <CalendarContainer>
          <Calendar 
            onPeriodChange={handlePeriodChange}
            onTransactionsChange={handleTransactionsChange}
            onError={onError}
            expenses={expenses}
            hideHeader={true}
          />
        </CalendarContainer>
        
        <ButtonContainer>
          <SelectButton onClick={handleSelect} disabled={!selectedPeriod}>
            Выбрать период
          </SelectButton>
        </ButtonContainer>
      </PeriodSelectionModal>
    </PeriodSelectionContainer>
  );
};

export default PeriodSelection;
