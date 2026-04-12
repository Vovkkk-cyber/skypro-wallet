# SkyproWallet

установленные библиотеки: 

- Styled Components (для стилизации);
- React Router (для маршрутизации между страницами);
- axios (для работы с АПИ);

***настройки ESLint устновлены по умолчанию (правила не изменены после установки). 

структура проекта (папки): 
- assets (для изображений, шрифтов и других статических файлов)
- components (для компонентов, каждый компонент обернут в свою папку)
  -- auth-form 
  -- buttons 
  -- calendar
  -- inputs
- context (пока просто создала, дальше будет использована при работе с АПИ)
- pages (для страниц проекта) 
- services (для запросов АПИ)
- utils (для различных вспомогательных функций и файлов, напр., форматирование дат, хранение различных массивов)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
