import React from 'react';
import styled from 'styled-components';
import { EditIcon, DeleteIcon } from '../components/Icons';

// Стиль таблицы
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-top: 20px;
`;

// Заголовок столбца (th)
const TableHeader = styled.th`
  padding: 12px;
  border-bottom: 2px solid #ddd;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
  font-family: 'Montserrat', sans-serif;
  color: #999999;
`;

// Строка таблицы
const TableRow = styled.tr`
  &:nth-child(even) {
    background: #ffffff;
  }
  &:hover {
    background: #e6f3e6;
  }
  transition: background 0.3s ease;
`;

// Ячейка таблицы
const TableCell = styled.td`
  padding: 12px;
  font-size: 12px;
  border-bottom: 1px solid #eee;
  color: #000000;
  font-family: 'Montserrat', sans-serif;
  transition: color 0.3s ease;
`;

// Кнопка действия (редактировать/удалить)
const ActionButton = styled.button`
  margin: 0 5px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 16px;
  transition: color 0.3s ease;

  &:hover svg {
    fill: #1FA46C;
  }
`;

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>Описание</TableHeader>
          <TableHeader>Категория</TableHeader>
          <TableHeader>Дата</TableHeader>
          <TableHeader>Сумма</TableHeader>
          <TableHeader>Действия</TableHeader>
        </tr>
      </thead>
      <tbody>
        {expenses.length === 0 ? (
          <tr>
            <TableCell colSpan="5">Нет данных</TableCell>
          </tr>
        ) : (
          expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.displayCategory}</TableCell>
              <TableCell>{expense.displayDate}</TableCell>
              <TableCell>{`${expense.amount.toLocaleString('ru-RU')} Р`}</TableCell>
              <TableCell>
                <ActionButton aria-label="edit" onClick={() => onEdit(expense)}>
                  <EditIcon />
                </ActionButton>
                <ActionButton aria-label="delete" onClick={() => onDelete(expense.id)}>
                  <DeleteIcon />
                </ActionButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default ExpenseTable;