import React, { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import Header from "../components/Header";
import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";
import FilterControls from "./FilterControls";
import {
  getTransactions,
  addOrUpdateTransaction,
  deleteTransaction,
} from "../services/transactions";
import { AuthContext } from "../context/AuthContext";
import { format, parse } from "date-fns";
import { categories } from "../constants/categories.js";

// Стили
const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #000000;
  padding: 5px 10px;
  border-radius: 8px;
  line-height: 150%;
  margin-bottom: 20px;
`;

const TableAndFormWrapper = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TableSection = styled.div`
  flex: 2;
  background: #ffffff;
  border-radius: 30px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 789px;
  max-width: 789px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 100%;
    border-radius: 30px;
  }
  &::-webkit-scrollbar-track {
    background: #d9d9d9;
  }
  &::-webkit-scrollbar-thumb {
    background: #bbbbbb;
    border-radius: 30px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #b0b0b0;
  }
`;

const TableTitle = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0px;
  color: #000000;
  margin-bottom: 20px;
`;

const FormSection = styled.div`
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 30%;
`;

const TableControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
`;

const MainPage = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [editData, setEditData] = useState(null);

  // Загрузка транзакций
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.token) {
        toast.error("Токен отсутствует, пожалуйста, войдите в систему");
        return;
      }
      try {
        const data = await getTransactions(
          { sortBy, filterBy: filterCategory },
          user.token
        );
        const formattedExpenses = data.map((item) => ({
          ...item,
          id: item._id,
          amount: item.sum,
          description: item.description,
          date: new Date(item.date),
          displayDate: format(new Date(item.date), "dd.MM.yyyy"),
          displayCategory:
            categories.find((cat) => cat.value === item.category)?.label ||
            item.category,
        }));
        setExpenses(formattedExpenses);
      } catch (error) {
        if (error.message.includes("401")) {
          toast.error("Пожалуйста, войдите в систему");
        } else if (error.message.includes("400")) {
          toast.error(error.message || "Неверные параметры запроса");
        } else {
          toast.error(error.message || "Ошибка при загрузке транзакций");
        }
        setExpenses([]);
      }
    };
    fetchTransactions();
  }, [filterCategory, sortBy, user?.token]);

  // Обработка редактирования
  const handleEdit = (expense) => {
    setSelectedId(expense._id);
    setEditData({
      ...expense,
      _id: expense._id,
      sum: expense.amount,
      description: expense.description,
      date: format(new Date(expense.date), "yyyy-MM-dd"),
      displayDate: expense.displayDate,
      displayCategory:
        categories.find((cat) => cat.value === expense.category)?.label ||
        expense.category,
      category: expense.category,
    });
  };

  // Обработка удаления
  const handleDelete = async (id) => {
    if (!user?.token) return;
    const yesDelete = confirm("Вы действительно хотите удалить запись?");
    if (!yesDelete) return;
    try {
      const updatedList = await deleteTransaction(id, user.token);
      const formattedExpenses = updatedList.map((item) => ({
        ...item,
        id: item._id,
        amount: item.sum,
        description: item.description,
        date: new Date(item.date),
        displayDate: format(new Date(item.date), "dd.MM.yyyy"),
        displayCategory:
          categories.find((cat) => cat.value === item.category)?.label ||
          item.category,
      }));
      setExpenses(formattedExpenses);
      toast.success("Транзакция успешно удалена!");
      if (selectedId === id) {
        setSelectedId(null);
        setEditData(null);
      }
    } catch (error) {
      if (error.message.includes("401")) {
        toast.error("Пожалуйста, войдите в систему");
      } else if (error.message.includes("400")) {
        toast.error(error.message || "Транзакция не найдена");
      } else {
        toast.error(error.message || "Ошибка при удалении транзакции");
      }
    }
  };

  // Обработка отправки формы
  const handleFormSubmit = async (data) => {
    if (!user?.token) {
      toast.error("Токен отсутствует, пожалуйста, войдите в систему");
      return { success: false };
    }
    try {
      if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        throw new Error("Неверный формат даты");
      }
      const categoryValue = categories.find(
        (cat) => cat.label === data.displayCategory
      )?.value;
      if (!categoryValue) {
        throw new Error("Неверная категория");
      }
      let parsedDate;
      try {
        parsedDate = parse(data.date, "yyyy-MM-dd", new Date());
      } catch {
        throw new Error("Неверное значение даты");
      }
      const isoDate = format(parsedDate, "yyyy-MM-dd'T00:00:00.000Z'");
      const formattedData = {
        ...data,
        _id: data.id || undefined,
        sum: Number(data.amount),
        description: data.description,
        category: categoryValue,
        date: isoDate,
      };
      const updatedList = await addOrUpdateTransaction(
        formattedData,
        user.token
      );
      const formattedExpenses = updatedList.map((item) => ({
        ...item,
        id: item._id,
        amount: item.sum,
        description: item.description,
        date: new Date(item.date),
        displayDate: format(new Date(item.date), "dd.MM.yyyy"),
        displayCategory:
          categories.find((cat) => cat.value === item.category)?.label ||
          item.category,
      }));
      setExpenses(formattedExpenses);
      setSelectedId(null);
      setEditData(null);
      return { success: true };
    } catch (error) {
      if (error.message.includes("401")) {
        toast.error("Пожалуйста, войдите в систему");
      } else if (error.message.includes("400")) {
        toast.error(error.message || "Неверные данные транзакции");
      } else {
        toast.error(error.message || "Ошибка при сохранении транзакции");
      }
      return { success: false };
    }
  };

  // Обработка отмены редактирования
  const handleFormCancel = () => {
    setSelectedId(null);
    setEditData(null);
  };

  return (
    <>
      <Header currentPath="/" />
      <Container>
        <ContentWrapper>
          <MainContent>
            <MainTitle>Мои расходы</MainTitle>
            <TableAndFormWrapper>
              <TableSection>
                <TableControlsWrapper>
                  <TableTitle>Таблица расходов</TableTitle>
                  <FilterControls
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                  />
                </TableControlsWrapper>
                <ExpenseTable
                  expenses={expenses}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TableSection>
              <FormSection>
                <ExpenseForm
                  editData={editData}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </FormSection>
            </TableAndFormWrapper>
          </MainContent>
        </ContentWrapper>
        <Outlet />
      </Container>
    </>
  );
};

export default MainPage;
