import { Route, Routes } from "react-router-dom";
import MainPage from "../../pages/Main";
import SignInPage from "../../pages/SignIn";
import SignUpPage from "../../pages/SignUp";
import NewSpendingPage from "../../pages/NewSpending";
import EditSpendingPage from "../../pages/EditSpending";
import SpendingAnalysisPage from "../../pages/SpendingAnalysis";
import NotFoundPage from "../../pages/NotFound";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainPage />}>
          <Route path="spending/new" element={<NewSpendingPage />} />
          <Route path="spending/:id" element={<EditSpendingPage />} />
        </Route>
        <Route path="/spending-analysis" element={<SpendingAnalysisPage />} />
      </Route>

      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
