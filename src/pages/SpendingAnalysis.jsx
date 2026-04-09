import Header from '../components/Header';
import Analytics from '../components/analytics/Diagramm';
import Calendar from '../components/calendar/Calendar';
import PeriodSelection from '../components/period-selection/PeriodSelection';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

// --- Стили для страницы ---
const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SpendingAnalysisWrapper = styled.div`
  padding: 10px 20px;
  
  @media (max-width: 768px) {
    padding: 10px 16px;
  }
`;

const PageTitle = styled.h2`
  padding-top: 36px;
  
  @media (max-width: 768px) {
    padding-top: 20px;
    font-size: 20px;
    text-align: center;
  }
`;

const MobilePeriodButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    height: 44px;
    background: #24A148;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      background: #1e8a3e;
    }
  }
`;

const DesktopCalendar = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const AnalyticsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AnalysisContainer = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 20px; // Отступ между календарем и аналитикой
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
    padding: 0 16px;
  }
`;

/**
 * Страница анализа расходов
 * Позволяет выбрать период и посмотреть аналитику по расходам
 */
const SpendingAnalysisPage = () => {
  // Выбранный пользователем период (строка)
  const [selectedPeriod, setSelectedPeriod] = useState('');
  // Список расходов (загружается из localStorage)
  const [expenses, setExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // Состояние для ошибки получения транзакций
  const [error, setError] = useState(null);
  // Состояние для модального окна выбора периода (мобильные устройства)
  const [isPeriodSelectionOpen, setIsPeriodSelectionOpen] = useState(false);

  // Загружаем расходы из localStorage (где их сохраняет MainPage)
  useEffect(() => {
    function loadExpensesFromStorage() {
      const savedExpenses = localStorage.getItem('expenses');
      if (savedExpenses) {
        try {
          setExpenses(JSON.parse(savedExpenses));
        } catch (e) {
          console.error('Ошибка при разборе расходов', e);
        }
      }
    }
    loadExpensesFromStorage();
    // Подписываемся на изменения в localStorage (например, если расходы изменились в другой вкладке)
    window.addEventListener('storage', loadExpensesFromStorage);
    return () => window.removeEventListener('storage', loadExpensesFromStorage);
  }, []);

  // Функции для работы с модальным окном выбора периода
  const handleOpenPeriodSelection = () => {
    setIsPeriodSelectionOpen(true);
  };

  const handleClosePeriodSelection = () => {
    setIsPeriodSelectionOpen(false);
  };

  const handlePeriodSelect = (period) => {
    console.log('SpendingAnalysis: period selected:', period);
    setSelectedPeriod(period);
  };

  // --- UI ---
  return (
    <>
      {/* Шапка сайта */}
      <Header currentPath="/spending-analysis" />
      <ContentWrapper>
        <SpendingAnalysisWrapper>
          {/* Заголовок страницы */}
          <PageTitle>Анализ расходов</PageTitle>
          
          <AnalysisContainer>
            {/* Календарь для выбора периода (скрыт на мобильных) */}
            <DesktopCalendar>
              <Calendar onPeriodChange={setSelectedPeriod} onTransactionsChange={setTransactions} onError={setError} expenses={expenses} />
            </DesktopCalendar>
            {/* Аналитика по выбранному периоду */}
            <AnalyticsWrapper>
              <Analytics period={selectedPeriod} transactions={transactions} error={error} />
              {/* Кнопка выбора периода для мобильных устройств */}
              <MobilePeriodButton onClick={handleOpenPeriodSelection}>
                Выбрать другой период
              </MobilePeriodButton>
            </AnalyticsWrapper>
          </AnalysisContainer>
          
          {/* Модальное окно выбора периода для мобильных устройств */}
          <PeriodSelection
            isOpen={isPeriodSelectionOpen}
            onClose={handleClosePeriodSelection}
            onPeriodSelect={handlePeriodSelect}
            onTransactionsChange={setTransactions}
            onError={setError}
            expenses={expenses}
          />
        </SpendingAnalysisWrapper>
      </ContentWrapper>
    </>
  );
};

export default SpendingAnalysisPage;