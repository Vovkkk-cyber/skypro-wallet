import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ErrorMessage } from '../components/CommonComponents.jsx';
import { format, parse } from 'date-fns';
import { InputWrapper } from '../components/inputs/SInput.styled.js';
import Input from '../components/inputs/Input.jsx';
import Button from '../components/buttons/Button.jsx';
import { ErrorStarContainer } from '../components/errors/SErrorContainer.styled.js';
import { categories } from '../constants/categories.js';

// Стили для заголовка формы
const FormTitle = styled.h3`
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  margin: 15px 0 20px 20px;
  color: #333;
  font-family: 'Montserrat', sans-serif;
`;

// Стили для заголовков полей
const FieldLabel = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin: 20px 0 20px 20px;
  color: #333;
  font-family: 'Montserrat', sans-serif;
`;

// Стили для кнопок категорий
const CategoryButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  margin: 5px;
  border: none;
  border-radius: 30px;
  background: #F4F5F6;
  color: #333;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    margin-right: 6px;
  }

  &:hover {
    background: #e0e0e0;
  }

  ${({ selected }) =>
    selected &&
    `
      background: #DBFFE9;
      color: #1FA46C;
      svg path {
        fill: #1FA46C;
      }
      &:hover {
        background: #C1FFD6;
      }
    `}
`;

// Контейнер для кнопок с отступом
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const ExpenseForm = ({ editData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    displayCategory: '',
    date: '',
    amount: '',
  });
  const [errors, setErrors] = useState({});
  const [statusInputs, setStatusInputs] = useState({
    description: 'default',
    date: 'default',
    amount: 'default',
  });
  const [isActiveButton, setIsActiveButton] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || undefined,
        description: editData.description || '',
        displayCategory: editData.displayCategory || '',
        date: editData.displayDate
          ? format(parse(editData.displayDate, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd')
          : '',
        amount: editData.amount ? editData.amount.toString() : '',
      });
      setStatusInputs({
        description: 'default',
        date: 'default',
        amount: 'default',
      });
      setIsActiveButton(true);
      setIsSubmitted(false);
      setErrors({});
    } else {
      setFormData({ description: '', displayCategory: '', date: '', amount: '' });
      setStatusInputs({
        description: 'default',
        date: 'default',
        amount: 'default',
      });
      setIsActiveButton(true);
      setIsSubmitted(false);
      setErrors({});
    }
  }, [editData]);

  const validateForm = () => {
    const newErrors = {};
    const newStatusInputs = { ...statusInputs };

    // Валидация description
    if (!formData.description.trim()) {
      newErrors.description = 'Обязательно для заполнения';
      newStatusInputs.description = 'error';
    } else if (formData.description.trim().length < 4) {
      newErrors.description = 'Минимум 4 символа';
      newStatusInputs.description = 'error';
    } else {
      newStatusInputs.description = 'correct';
    }

    // Валидация category
    if (!formData.displayCategory) {
      newErrors.displayCategory = 'Обязательно для заполнения';
    } else if (!categories.some(cat => cat.label === formData.displayCategory)) {
      newErrors.displayCategory = 'Выберите одну из категорий: Еда, Транспорт, Жилье, Развлечения, Образование, Другое';
    }

    // Валидация date
    if (!formData.date) {
      newErrors.date = 'Обязательно для заполнения';
      newStatusInputs.date = 'error';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      newErrors.date = 'Формат должен быть yyyy-MM-dd';
      newStatusInputs.date = 'error';
    } else {
      try {
        parse(formData.date, 'yyyy-MM-dd', new Date());
        newStatusInputs.date = 'correct';
      } catch {
        newErrors.date = 'Неверная дата';
        newStatusInputs.date = 'error';
      }
    }

    // Валидация amount
    if (!formData.amount) {
      newErrors.amount = 'Обязательно для заполнения';
      newStatusInputs.amount = 'error';
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Должно быть положительным числом';
      newStatusInputs.amount = 'error';
    } else {
      newStatusInputs.amount = 'correct';
    }

    setStatusInputs(newStatusInputs);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setIsActiveButton(true);
    setStatusInputs({ ...statusInputs, [name]: 'default' });

    if (name === 'description') {
      if (value.trim().length >= 4) {
        setStatusInputs({ ...statusInputs, [name]: 'correct' });
      } else {
        setStatusInputs({ ...statusInputs, [name]: 'error' });
      }
    }
    if (name === 'amount') {
      if (value && !isNaN(value) && Number(value) > 0) {
        setStatusInputs({ ...statusInputs, [name]: 'correct' });
      } else {
        setStatusInputs({ ...statusInputs, [name]: 'error' });
      }
    }
    if (name === 'date') {
      if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        try {
          parse(value, 'yyyy-MM-dd', new Date());
          setStatusInputs({ ...statusInputs, [name]: 'correct' });
        } catch {
          setStatusInputs({ ...statusInputs, [name]: 'error' });
        }
      } else {
        setStatusInputs({ ...statusInputs, [name]: 'error' });
      }
    }
  };

  const handleCategorySelect = (categoryLabel) => {
    setFormData({ ...formData, displayCategory: categoryLabel });
    setErrors({ ...errors, displayCategory: '' });
    setIsActiveButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setStatusInputs({
        description: 'default',
        date: 'default',
        amount: 'default',
      });
      console.log('Данные формы перед отправкой:', formData);
      const result = await onSubmit({
        ...formData,
        id: formData.id,
        amount: parseInt(formData.amount, 10),
        category: categories.find(cat => cat.label === formData.displayCategory)?.value,
        displayDate: formData.date,
      });
      if (result.success && !editData) {
        setFormData({
          description: '',
          displayCategory: '',
          date: '',
          amount: '',
        });
        setStatusInputs({
          description: 'default',
          date: 'default',
          amount: 'default',
        });
        setErrors({});
        setIsSubmitted(false);
        setIsActiveButton(true);
      }
    } else {
      setStatusInputs({
        description: newErrors.description ? 'error' : 'correct',
        date: newErrors.date ? 'error' : 'correct',
        amount: newErrors.amount ? 'error' : 'correct',
      });
      setIsActiveButton(false);
      setErrors(newErrors);
    }
  };

  const isValidInput = (value, field) => {
    if (field === 'description') {
      return value.trim() !== '' && value.trim().length >= 4;
    }
    if (field === 'date') {
      if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      try {
        parse(value, 'yyyy-MM-dd', new Date());
        return true;
      } catch {
        return false;
      }
    }
    if (field === 'amount') {
      return value && !isNaN(value) && Number(value) > 0;
    }
    return false;
  };

  return (
    <>
      <FormTitle>{editData ? 'Редактирование' : 'Новый расход'}</FormTitle>
      <form onSubmit={handleSubmit}>
        <FieldLabel>Описание</FieldLabel>
        <InputWrapper>
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Введите описание"
            statusInput={statusInputs.description}
          />
          {errors.description && isSubmitted && (
            <ErrorStarContainer>*</ErrorStarContainer>
          )}
        </InputWrapper>
        {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        <FieldLabel>Категории</FieldLabel>
        {categories.filter(cat => cat.value !== '').map((cat) => {
          const IconComponent = cat.icon; // Получаем компонент иконки
          return (
            <CategoryButton
              key={cat.value}
              selected={formData.displayCategory === cat.label}
              onClick={() => handleCategorySelect(cat.label)}
            >
              {IconComponent && <IconComponent />}
              {cat.label}
            </CategoryButton>
          );
        })}
        {errors.displayCategory && isSubmitted && (
          <ErrorStarContainer>*</ErrorStarContainer>
        )}
        {errors.displayCategory && <ErrorMessage>{errors.displayCategory}</ErrorMessage>}
        <FieldLabel>Дата</FieldLabel>
        <InputWrapper>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="Введите дату"
            statusInput={statusInputs.date}
          />
          {errors.date && isSubmitted && <ErrorStarContainer>*</ErrorStarContainer>}
        </InputWrapper>
        {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
        <FieldLabel>Сумма</FieldLabel>
        <InputWrapper>
          <Input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Введите сумму"
            statusInput={statusInputs.amount}
          />
          {errors.amount && isSubmitted && <ErrorStarContainer>*</ErrorStarContainer>}
        </InputWrapper>
        {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
        {editData ? (
          <ButtonWrapper>
            <Button type="submit" isActive={isActiveButton}>
              Сохранить редактирование
            </Button>
            <Button isActive={true} onClick={onCancel}>
              Отмена
            </Button>
          </ButtonWrapper>
        ) : (
          <Button type="submit" isActive={isActiveButton}>
            Добавить новый расход
          </Button>
        )}
      </form>
    </>
  );
};

export default ExpenseForm;