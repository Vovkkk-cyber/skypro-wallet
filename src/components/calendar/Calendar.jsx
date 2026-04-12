import React, { useState, useContext } from 'react';
import {
  CalendarWrapper,
  CalendarHeader,
  CalendarTitle,
  ViewToggle,
  ToggleButton,
  WeekdaysHeader,
  Weekday,
  ScrollContainer
} from './Calendar.styled';
import MonthView from './MonthView/MonthView.jsx';
import YearView from './YearView/YearView.jsx';
import { formatDate, formatMonth, formatMDY } from './dateUtils';
import { WEEKDAYS_SHORT, MONTH_NAMES } from './constants/constant.js';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { getTransactionsPeriod } from '../../services/transactions.js';
import { AuthContext } from '../../context/AuthContext';

/**
 * Календарь для выбора периода (месяц или год)
 * Позволяет выбрать диапазон дат или месяцев и сообщает выбранный период через onPeriodChange
 */
const Calendar = ({ onPeriodChange, onTransactionsChange, onError, hideHeader = false }) => {
  // Режим отображения: 'month' — по дням, 'year' — по месяцам
  const [viewMode, setViewMode] = useState('month');

  // Для выбора диапазона дней
  const [selectedStartDay, setSelectedStartDay] = useState(null);
  const [selectedEndDay, setSelectedEndDay] = useState(null);

  // Для выбора диапазона месяцев
  const [selectedStartMonth, setSelectedStartMonth] = useState(null);
  const [selectedEndMonth, setSelectedEndMonth] = useState(null);

  // Добавляем состояние для выбранного года и месяца
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11

  const { user } = useContext(AuthContext);
  const token = user?.token;

  /**
   * Обработка клика по дню в режиме "месяц"
   * Позволяет выбрать диапазон дат (от и до)
   */
  function handleDayClick(date) {
    let start = selectedStartDay;
    let end = selectedEndDay;

    if (start && end) {
      // Если уже выбран диапазон — сбрасываем выбор (3-й клик)
      setSelectedStartDay(null);
      setSelectedEndDay(null);
      updatePeriodLabel(null, null);
      return;
    }
    if (!start) {
      // Если ничего не выбрано — выбираем старт
      start = date;
      end = null;
    } else {
      // Если выбран только старт — определяем конец диапазона
      if (new Date(date) < new Date(start)) {
        end = start;
        start = date;
      } else {
        end = date;
      }
    }
    setSelectedStartDay(start);
    setSelectedEndDay(end);
    updatePeriodLabel(start, end);
  }

  /**
   * Обработка клика по месяцу в режиме "год"
   * Позволяет выбрать диапазон месяцев (от и до)
   */
  function handleMonthClick(year, month) {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    let start = selectedStartMonth;
    let end = selectedEndMonth;

    if (start && end) {
      // Если уже выбран диапазон — сбрасываем выбор
      setSelectedStartMonth(null);
      setSelectedEndMonth(null);
      updatePeriodLabel(null, null);
      return;
    }
    if (!start) {
      setSelectedStartMonth(monthKey);
      updatePeriodLabel(monthKey, null);
    } else {
      // Определяем порядок месяцев
      const [startYear, startMonth] = start.split('-').map(Number);
      if (year < startYear || (year === startYear && month < startMonth)) {
        setSelectedEndMonth(start);
        setSelectedStartMonth(monthKey);
        updatePeriodLabel(monthKey, start);
      } else {
        setSelectedEndMonth(monthKey);
        updatePeriodLabel(start, monthKey);
      }
    }
  }

  /**
   * Обновляет отображаемый период и сообщает его родителю
   */
  function updatePeriodLabel(start, end) {
    if (!onPeriodChange) return;
    if (viewMode === 'month') {
      if (start && end) {
        onPeriodChange(`${formatDate(start)} - ${formatDate(end)}`);
        const startVal = formatMDY(start);
        const endVal = formatMDY(end);
        getTransactionsPeriod({
          start: startVal,
          end: endVal
        }, token)
          .then(data => {
            if (typeof onTransactionsChange === 'function') {
              onTransactionsChange(data);
            }
          })
            .catch(e => {
              if (typeof onError === 'function') {
                let msg = e && e.message ? e.message : 'Ошибка получения транзакций';
                if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
                  msg = 'Нет соединения с интернетом или сервер недоступен. Попробуйте позже.';
                }
                onError(msg);
              }
              console.error('Ошибка получения транзакций:', e.message);
            });
      } else if (start) {
        onPeriodChange(formatDate(start));
      } else {
        onPeriodChange('');
      }
    } else {
      if (start && end) {
        // Преобразуем '2024-01' в 'месяц-день-год', где день = 1 для начала и последний день месяца для конца
        const parseMonthKey = (key, isEnd = false) => {
          const [year, month] = key.split('-').map(Number);
          const day = isEnd
            ? new Date(year, month, 0).getDate() // последний день месяца
            : 1;
          // month - 1, потому что new Date ожидает 0-11
          return formatMDY(new Date(year, month - 1, day));
        };
        onPeriodChange(`${formatMonth(start)} - ${formatMonth(end)}`);
        const startVal = parseMonthKey(start, false);
        const endVal = parseMonthKey(end, true);
        console.log('POST period (year mode):', { start: startVal, end: endVal });
        console.log('Selected months:', { start, end });
        getTransactionsPeriod({
          start: startVal,
          end: endVal
        }, token)
          .then(data => {
            console.log('Received transactions data:', data);
            if (typeof onTransactionsChange === 'function') {
              onTransactionsChange(data);
            }
          })
            .catch(e => {
              console.error('Error fetching transactions:', e);
              if (typeof onError === 'function') {
                let msg = e && e.message ? e.message : 'Ошибка получения транзакций';
                if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
                  msg = 'Нет соединения с интернетом или сервер недоступен. Попробуйте позже.';
                }
                onError(msg);
              }
              console.error('Ошибка получения транзакций:', e.message);
            });
      } else if (start) {
        onPeriodChange(formatMonth(start));
      } else {
        onPeriodChange('');
      }
    }
  }

  // --- UI ---
  return (
    <CalendarWrapper>
      {/* Заголовок и переключатель режима */}
      {!hideHeader && (
        <CalendarHeader>
          <CalendarTitle>Период</CalendarTitle>
          <ViewToggle>
            <ToggleButton
              $isActive={viewMode === 'month'}
              onClick={() => {
                setViewMode('month');
                // Сброс диапазона при смене режима
                setSelectedStartDay(null);
                setSelectedEndDay(null);
                setSelectedStartMonth(null);
                setSelectedEndMonth(null);
                updatePeriodLabel(null, null);
              }}
            >
              Месяц
            </ToggleButton>
            <ToggleButton
              $isActive={viewMode === 'year'}
              onClick={() => {
                setViewMode('year');
                // Сброс диапазона при смене режима
                setSelectedStartDay(null);
                setSelectedEndDay(null);
                setSelectedStartMonth(null);
                setSelectedEndMonth(null);
                updatePeriodLabel(null, null);
              }}
            >
              Год
            </ToggleButton>
          </ViewToggle>
        </CalendarHeader>
      )}
      
      {/* Переключатель режима для модального окна */}
      {hideHeader && (
        <ViewToggle style={{ padding: '20px', justifyContent: 'center' }}>
          <ToggleButton
            $isActive={viewMode === 'month'}
            onClick={() => {
              setViewMode('month');
              // Сброс диапазона при смене режима
              setSelectedStartDay(null);
              setSelectedEndDay(null);
              setSelectedStartMonth(null);
              setSelectedEndMonth(null);
              updatePeriodLabel(null, null);
            }}
          >
            Месяц
          </ToggleButton>
          <ToggleButton
            $isActive={viewMode === 'year'}
            onClick={() => {
              setViewMode('year');
              // Сброс диапазона при смене режима
              setSelectedStartDay(null);
              setSelectedEndDay(null);
              setSelectedStartMonth(null);
              setSelectedEndMonth(null);
              updatePeriodLabel(null, null);
            }}
          >
            Год
          </ToggleButton>
        </ViewToggle>
      )}

      {/* Вкладки месяцев и навигация по годам */}
      {viewMode === 'month' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <MdKeyboardArrowLeft
            size={28}
            style={{ cursor: 'pointer' }}
            onClick={() => setCurrentYear(currentYear - 1)}
            title="Предыдущий год"
          />
          <span style={{ fontWeight: 600, minWidth: 70, textAlign: 'center' }}>{currentYear}</span>
          <MdKeyboardArrowRight
            size={28}
            style={{ cursor: 'pointer' }}
            onClick={() => setCurrentYear(currentYear + 1)}
            title="Следующий год"
          />
        </div>
      )}

      {/* В зависимости от режима — показываем дни или месяцы */}
      {viewMode === 'month' ? (
        <>
          {/* Фиксированные дни недели */}
          <WeekdaysHeader>
            {WEEKDAYS_SHORT.map((wd) => (
              <Weekday key={wd}>{wd}</Weekday>
            ))}
          </WeekdaysHeader>
          <ScrollContainer style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: 700 }}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <MonthView
                key={idx}
                month={idx + 1}
                year={currentYear}
                title={`${MONTH_NAMES[idx]} ${currentYear}`}
                startDate={selectedStartDay}
                endDate={selectedEndDay}
                onDayClick={handleDayClick}
              />
            ))}
          </ScrollContainer>
        </>
      ) : (
        <YearView
          years={[currentYear, currentYear + 1]}
          startMonth={selectedStartMonth}
          endMonth={selectedEndMonth}
          onMonthClick={handleMonthClick}
        />
      )}
    </CalendarWrapper>
  );
};

export default Calendar;