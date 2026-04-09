import './App.css';
import { GlobalStyle } from './components/global-style/GlobalStyle.style';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './components/routes/AppRoutes';
import AuthProvider from './context/AuthProvider';

function App() {
  return (
    <>
      <AuthProvider>
        <GlobalStyle />
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;