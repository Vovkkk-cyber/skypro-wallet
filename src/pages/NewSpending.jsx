import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
`;

const FormInput = styled.input`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid ${props => props.error ? '#ff4444' : '#ddd'};
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
`;

const FormSelect = styled.select`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #00C853;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const NewSpendingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    date: '',
    amount: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = 'Описание обязательно';
    if (!formData.category) newErrors.category = 'Категория обязательна';
    if (!formData.date) newErrors.date = 'Дата обязательна';
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = 'Сумма обязательна и должна быть числом';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Simulate adding to MainPage state (replace with API or context)
      console.log('New expense added:', formData);
      navigate('/');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Header currentPath="/spending/new" />
      <Container>
        <FormWrapper>
          <FormTitle>Новый расход</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormInput
              name="description"
              placeholder="Введите описание"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            <FormSelect
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Выберите категорию</option>
              <option value="Еда">Еда</option>
              <option value="Транспорт">Транспорт</option>
              <option value="Развлечения">Развлечения</option>
              <option value="Другое">Другое</option>
            </FormSelect>
            {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
            <FormInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
            />
            {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
            <FormInput
              name="amount"
              placeholder="Введите сумму"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
            />
            {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
            <FormButton type="submit">Добавить новый расход</FormButton>
          </form>
        </FormWrapper>
      </Container>
    </>
  );
};

export default NewSpendingPage;