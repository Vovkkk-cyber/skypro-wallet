import { categories } from "../constants/categories.js";

const validCategories = categories
  .map((cat) => cat.value)
  .filter((value) => value !== "");

export const addOrUpdateTransaction = async (transactionData, token) => {
  try {
    if (!token) throw new Error("Токен отсутствует");
    if (!validCategories.includes(transactionData.category)) {
      throw new Error("Неверная категория");
    }
    if (transactionData.description.length < 4) {
      throw new Error("Описание должно быть минимум 4 символа");
    }
    if (transactionData.sum <= 0 || isNaN(transactionData.sum)) {
      throw new Error("Сумма должна быть положительным числом");
    }
    try {
      new Date(transactionData.date);
    } catch {
      throw new Error("Неверный формат даты");
    }

    const url = transactionData._id
      ? `https://wedev-api.sky.pro/api/transactions/${transactionData._id}`
      : "https://wedev-api.sky.pro/api/transactions";
    const method = transactionData._id ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description: transactionData.description,
        sum: Number(transactionData.sum),
        category: transactionData.category,
        date: transactionData.date,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) {
        throw new Error(errorData.message || "Неверные данные транзакции");
      }
      if (response.status === 401) {
        throw new Error("Требуется авторизация");
      }
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.transactions || [];
  } catch (error) {
    throw error.message || "Ошибка сервера";
  }
};

export const getTransactions = async (filters = {}, token) => {
  try {
    if (!token) throw new Error("Токен отсутствует");

    const query = new URLSearchParams();
    if (filters.sortBy) query.set("sortBy", filters.sortBy);
    if (filters.filterBy) query.set("filterBy", filters.filterBy);

    const response = await fetch(
      `https://wedev-api.sky.pro/api/transactions?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) {
        throw new Error(errorData.message || "Неверные параметры запроса");
      }
      if (response.status === 401) {
        throw new Error("Требуется авторизация");
      }
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error.message || "Ошибка сервера";
  }
};

export const deleteTransaction = async (id, token) => {
  try {
    if (!token) throw new Error("Токен отсутствует");

    const response = await fetch(
      `https://wedev-api.sky.pro/api/transactions/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) {
        throw new Error(errorData.message || "Транзакция не найдена");
      }
      if (response.status === 401) {
        throw new Error("Требуется авторизация");
      }
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.transactions || [];
  } catch (error) {
    throw error.message || "Ошибка сервера";
  }
};

export const getTransactionsPeriod = async (period, token) => {
  try {
    if (!token) throw new Error("Токен отсутствует");

    console.log('API: requesting period data:', period);

    const response = await fetch(
      "https://wedev-api.sky.pro/api/transactions/period",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start: period.start,
          end: period.end,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) {
        throw new Error(errorData.message || "Неверный период");
      }
      if (response.status === 401) {
        throw new Error("Требуется авторизация");
      }
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('API: received response:', responseData);
    
    // Возвращаем массив транзакций, как в других функциях
    return responseData.transactions || responseData || [];
  } catch (error) {
    console.error('API: error fetching period data:', error);
    throw error.message || "Ошибка сервера";
  }
};
