import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';
import styled from 'styled-components';

// Регистрируем необходимые модули Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Стили ---
const AnalyticsContainer = styled.div`
  width: 789px;
  height: 540px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 16px;
    border-radius: 12px;
    max-width: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  margin-bottom: 16px;
  font-size: 18px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
  word-break: break-all;
  
  @media (max-width: 768px) {
    font-size: 18px;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;

const PeriodLabel = styled.div`
  color: #666;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const AmountContainer = styled.div`
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
    padding: 0 4px;
  }
`;

const ChartContainer = styled.div`
  height: calc(100% - 60px);
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background-color: white;
  padding: 12px;
  
  @media (max-width: 768px) {
    height: 250px;
    padding: 8px;
  }
`;

/**
 * Аналитика расходов за выбранный период
 * Показывает сумму и столбчатую диаграмму по категориям
 */
const Analytics = ({ period, transactions = [], error }) => {
  // Категории для графика (ключи на английском)
  const categories = [
    'food',
    'transport',
    'housing',
    'entertainment',
    'education',
    'others',
  ];

  // Переводы категорий для отображения
  const categoryLabels = {
    food: 'Еда',
    transport: 'Транспорт',
    housing: 'Жилье',
    entertainment: 'Развлечения',
    education: 'Образование',
    others: 'Другое',
  };

  // Функция для нормализации категории
  const normalizeCategory = (cat) => (cat || '').trim().toLowerCase();

  // Маппинг серверных категорий к ключам графика
  const categoryMap = {
    food: 'food',
    transport: 'transport',
    housing: 'housing',
    entertainment: 'entertainment',
    education: 'education',
    others: 'others',
    other: 'others',
  };

  // Группировка расходов по категориям
  const categorySums = useMemo(() => {
    console.log('Analytics: processing transactions:', transactions);
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      console.log('Analytics: no transactions data');
      return Array(categories.length).fill(0);
    }
    const sums = Array(categories.length).fill(0);
    transactions.forEach((t) => {
      const key = categoryMap[normalizeCategory(t.category)];
      const idx = categories.indexOf(key);
      if (idx !== -1) {
        sums[idx] += Number(t.sum) || 0;
      }
    });
    console.log('Analytics: calculated sums:', sums);
    return sums;
  }, [transactions, categories]);

  // Максимальное значение для ограничения роста столбиков (80% высоты)
  const maxValue = useMemo(() => Math.max(...categorySums), [categorySums]);
  const yMax = useMemo(() => {
    if (maxValue <= 0) return 10;
    // На мобильных устройствах делаем столбцы ниже
    const isMobile = window.innerWidth <= 768;
    return isMobile ? maxValue / 0.75 : maxValue / 0.87;
  }, [maxValue]);

  // Сумма всех расходов
  const total = useMemo(() => categorySums.reduce((a, b) => a + b, 0), [categorySums]);

  const chartData = useMemo(() => ({
    labels: categories.map((key) => categoryLabels[key]),
    datasets: [
      {
        label: 'Расходы',
        data: categorySums,
        backgroundColor: [
          'rgb(217, 182, 255)',
          'rgb(255, 181, 61)',
          'rgb(110, 228, 254)',
          'rgb(176, 174, 255)',
          'rgb(188, 236, 48)',
          'rgb(255, 185, 184)',
        ],
        borderColor: [
          'rgb(217, 182, 255)',
          'rgb(255, 181, 61)',
          'rgb(110, 228, 254)',
          'rgb(176, 174, 255)',
          'rgb(188, 236, 48)',
          'rgb(255, 185, 184)',
        ],
        borderWidth: 1,
        borderRadius: 12,
      },
    ],
  }), [categories, categoryLabels, categorySums]);

  // Настройки графика
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} ₽`,
        },
      },
    },
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        max: yMax,
      },
      x: {
        grid: { display: false },
        ticks: { 
          padding: 0,
          // Добавляем больше отступов снизу на мобильных
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
    layout: { 
      padding: {
        bottom: window.innerWidth <= 768 ? 20 : 0
      }
    },
    animation: { duration: 1000 },
  };

  // Плагин для отображения значений над столбцами
  const showValuesPlugin = {
    id: 'showValues',
    afterDatasetsDraw(chart) {
      if (!chart || !chart.ctx || !chart.data || !chart.chartArea) return;
      const ctx = chart.ctx;
      const data = chart.data;
      const chartArea = chart.chartArea;
      const top = chartArea.top || 0;
      const bottom = chartArea.bottom || 0;
      const left = chartArea.left || 0;
      const right = chartArea.right || 0;
      if (!chart.scales || !chart.scales.x || !chart.scales.y) return;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      // Адаптивный размер шрифта для мобильных устройств
      const isMobile = window.innerWidth <= 768;
      ctx.font = isMobile ? 'bold 12px Arial' : 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#333';
      if (!data.datasets || data.datasets.length === 0) return;
      const dataset = data.datasets[0];
      if (!dataset.data) return;
      dataset.data.forEach((value, index) => {
        try {
          const xPos = xScale.getPixelForValue(index);
          // Текст всегда над столбиком, но не выходит за пределы графика
          const offset = isMobile ? 20 : 30;
          const yPosRaw = yScale.getPixelForValue(value) - offset;
          const yZero = yScale.getPixelForValue(0) - 8;
          const yPos = Math.max(Math.min(yPosRaw, yZero), top + 8);
          if (xPos >= left && xPos <= right && yPos >= top && yPos <= bottom) {
            ctx.fillText(`${value} ₽`, xPos, yPos);
          }
        } catch (error) {
          console.error('Ошибка при отрисовке значения:', error);
        }
      });
    },
  };

  // --- UI ---
  return (
    <AnalyticsContainer>
      {error && (
        <ErrorMessage>
          {error === true
            ? 'Ошибка загрузки данных. Проверьте соединение с интернетом или попробуйте позже.'
            : error}
        </ErrorMessage>
      )}
      {/* Сумма расходов и подпись периода */}
      <AmountContainer>
        <TotalAmount>
          {total.toLocaleString()} ₽
        </TotalAmount>
        <PeriodLabel>
          {period
            ? `Расходы за ${period}`
            : 'Выберите период в календаре'}
        </PeriodLabel>
      </AmountContainer>

      {/* График расходов по категориям */}
      <ChartContainer>
        <Bar data={chartData} options={chartOptions} plugins={[showValuesPlugin]} />
      </ChartContainer>
    </AnalyticsContainer>
  );
};

export default Analytics;