import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0; 
  background: #f5f5f5;
  min-height: 100vh;
  width: 100%;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto; 
`;

const FormTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
  margin: 0;
`;

const FormInput = styled.input`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid ${props => props.valid ? '#006400' : '#ddd'};
  border-radius: 4px;
  background: ${props => props.valid ? '#fff' : 'transparent'};
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
`;

const FormSelect = styled.select`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  background: ${props => props.selected ? '#fff' : 'transparent'};
  color: ${props => props.selected ? '#000' : '#000'};
  &:after {
    content: ${props => props.selected ? '"✓"' : '""'};
    margin-left: 5px;
    color: #000;
  }
`;

const FormButton = styled.button`
  width: 100%;
  padding: 10px;
  background: ${props => props.delete ? '#ff4444' : '#00C853'};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const EditSpendingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: id,
    description: '',
    category: '',
    date: '',
    amount: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const sampleData = {
      '1': { description: 'Пятерочка', category: 'Еда', date: '2024-07-03', amount: '3500' },
      '2': { description: 'Яндекс Такси', category: 'Транспорт', date: '2024-07-03', amount: '730' },
      '3': { description: 'Аптека Витя', category: 'Другое', date: '2024-07-03', amount: '1200' },
      '4': { description: 'Бургер Кинг', category: 'Еда', date: '2024-07-03', amount: '950' },
      '5': { description: 'Деливери', category: 'Еда', date: '2024-07-02', amount: '1320' },
      '6': { description: 'Кофейня №1', category: 'Еда', date: '2024-07-02', amount: '400' },
      '7': { description: 'Билеты', category: 'Развлечения', date: '2024-06-29', amount: '600' },
      '8': { description: 'Перекресток', category: 'Еда', date: '2024-06-29', amount: '2360' },
      '9': { description: 'Лукойл', category: 'Транспорт', date: '2024-06-29', amount: '1000' },
      '10': { description: 'Летуаль', category: 'Другое', date: '2024-06-29', amount: '4300' },
      '11': { description: 'Яндекс Такси', category: 'Транспорт', date: '2024-06-28', amount: '320' },
      '12': { description: 'Перекресток', category: 'Еда', date: '2024-06-28', amount: '1360' },
      '13': { description: 'Деливери', category: 'Еда', date: '2024-06-28', amount: '2320' },
      '14': { description: 'Вкусивли', category: 'Еда', date: '2024-06-27', amount: '1220' },
      '15': { description: 'Кофейня №1', category: 'Еда', date: '2024-06-27', amount: '920' },
      '16': { description: 'Вкусивли', category: 'Еда', date: '2024-06-26', amount: '840' },
      '17': { description: 'Кофейня №1', category: 'Еда', date: '2024-06-26', amount: '920' },
    };
    if (sampleData[id]) {
      setFormData({ id, ...sampleData[id], amount: sampleData[id].amount.toString() });
    }
  }, [id]);

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
      navigate('/', { state: { updatedExpense: formData } });
    } else {
      setErrors(newErrors);
    }
  };

  const handleDelete = () => {
    navigate('/', { state: { deletedId: id } });
  };

  return (
    <>
      <Header currentPath={`/spending/${id}`} />
      <Container>
        <FormWrapper>
          <FormTitle>Редактирование расхода</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormInput
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание"
              valid={formData.description && formData.description.trim() !== ''}
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            <FormSelect
              name="category"
              value={formData.category}
              onChange={handleChange}
              selected={formData.category !== ''}
            >
              <option value="">Выберите категорию</option>
              <option value="Еда">Еда</option>
              <option value="Транспорт">Транспорт</option>
              <option value="Жилье">Жилье</option>
              <option value="Развлечения">Развлечения</option>
              <option value="Образование">Образование</option>
              <option value="Другое">Другое</option>
            </FormSelect>
            {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
            <FormInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              valid={formData.date && formData.date.trim() !== ''}
            />
            {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
            <FormInput
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Введите сумму"
              valid={formData.amount && !isNaN(formData.amount) && parseInt(formData.amount) > 0}
            />
            {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
            <ButtonGroup>
              <FormButton type="submit">Сохранить редактирование</FormButton>
              <FormButton type="button" delete onClick={handleDelete}>Удалить</FormButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </Container>
    </>
  );
};

export default EditSpendingPage;