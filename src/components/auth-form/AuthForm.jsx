import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../inputs/Input";
import {
  AuthButtonContainer,
  AuthFormGroup,
  AuthFormLogin,
  AuthFormModal,
  AuthFormModalBlock,
  AuthFormModalTtl,
  SAuthForm,
} from "./SAuthForm.styled";
import Button from "../buttons/Button";
import {
  ErrorMessage,
  ErrorStarContainer,
} from "../errors/SErrorContainer.styled";
import { InputWrapper } from "../inputs/SInput.styled";
import { AuthContext } from "../../context/AuthContext";
import { signIn, signUp } from "../../services/auth";
import { Logo } from "../Header";
import { LogoIcon } from "../Icons";

const AuthForm = ({ isSignUp }) => {
  const { login } = useContext(AuthContext);
  const [values, setValues] = useState({
    name: "",
    login: "",
    password: "",
  });
  const [statusInputs, setStatusInputs] = useState({
    name: "default",
    login: "default",
    password: "default",
  });

  const [isTouched, setIsTouched] = useState({
    name: false,
    login: false,
    password: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isActiveButton, setIsActiveButton] = useState(true);

  const [errors, setErrors] = useState({
    name: false,
    login: false,
    password: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (inputName, value) => {
    setErrors((prev) => ({ ...prev, [inputName]: false }));
    setError("");
    setIsActiveButton(true);

    if (!isTouched[inputName]) {
      setIsTouched((prev) => ({ ...prev, [inputName]: true }));
    }

    if (isTouched[inputName]) {
      setErrors((prev) => ({ ...prev, [inputName]: false }));
    }

    setValues((prev) => ({ ...prev, [inputName]: value }));

    if (value.length === 0) {
      setStatusInputs((prev) => ({ ...prev, [inputName]: "default" }));
      setErrors({ ...errors, [inputName]: false });
      return;
    }

    if (value.length > 3) {
      setStatusInputs((prev) => ({ ...prev, [inputName]: "correct" }));
      setErrors({ ...errors, [inputName]: false });
    }

    if (value.length <= 3) {
      setStatusInputs((prev) => ({ ...prev, [inputName]: "error" }));
      setIsActiveButton(false);
      setErrors({ ...errors, [inputName]: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsTouched({ name: true, login: true, password: true });
    setIsSubmitted(true);

    const newErrors = { name: false, login: false, password: false };
    let isValid = true;

    if (isSignUp) {
      if (!values.name.trim() || values.name.trim().length <= 3) {
        newErrors.name = true;
        isValid = false;
      }
    }

    if (!values.login.trim() || values.login.trim().length <= 3) {
      newErrors.login = true;
      isValid = false;
    }

    if (!values.password.trim() || values.password.trim().length <= 3) {
      newErrors.password = true;
      isValid = false;
    }

    setErrors(newErrors);

    const newValues = { ...values };

    setValues(newValues);

    if (!isValid) {
      setIsActiveButton(false);
      setError(
        "Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку."
      );
      setStatusInputs((prev) => ({
        name: newErrors.name ? "error" : prev.name,
        login: newErrors.login ? "error" : prev.login,
        password: newErrors.password ? "error" : prev.password,
      }));

      return;
    }

    try {
      const data = !isSignUp
        ? await signIn({ login: values.login, password: values.password })
        : await signUp(values);

      if (data) {
        login({ ...data, password: null });
        setError("");
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      setErrors({ name: true, login: true, password: true });
      setStatusInputs({ name: "error", login: "error", password: "error" });
      setIsActiveButton(false);
    }
  };

  return (
    <>
      <Logo
        style={{
          width: "100%",
          height: "64px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center ",
        }}
      >
        <LogoIcon />
      </Logo>
      <SAuthForm>
        <AuthFormModal>
          <AuthFormModalBlock>
            <AuthFormModalTtl>
              <h2>{isSignUp ? "Регистрация" : "Вход"}</h2>
            </AuthFormModalTtl>
            <AuthFormLogin onSubmit={handleSubmit}>
              {isSignUp && (
                <InputWrapper>
                  <Input
                    id="formname"
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={values.name}
                    statusInput={statusInputs.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && isSubmitted && (
                    <ErrorStarContainer>*</ErrorStarContainer>
                  )}
                </InputWrapper>
              )}
              <InputWrapper>
                <Input
                  id="formlogin"
                  type="email"
                  name="login"
                  placeholder="Эл. почта"
                  value={values.login}
                  statusInput={statusInputs.login}
                  onChange={(e) => handleChange("login", e.target.value)}
                />
                {errors.login && isSubmitted && (
                  <ErrorStarContainer>*</ErrorStarContainer>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  id="formpassword"
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={values.password}
                  statusInput={statusInputs.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                {errors.password && isSubmitted && (
                  <ErrorStarContainer>*</ErrorStarContainer>
                )}
              </InputWrapper>
              <ErrorMessage>{error}</ErrorMessage>
              <AuthButtonContainer>
                <Button isActive={isActiveButton}>
                  {isSignUp ? "Зарегистрироваться" : "Войти"}
                </Button>
              </AuthButtonContainer>
            </AuthFormLogin>
            {!isSignUp && (
              <AuthFormGroup>
                <p>Нужно зарегистрироваться?</p>
                <Link to="/sign-up">Регистрируйтесь здесь</Link>
              </AuthFormGroup>
            )}
            {isSignUp && (
              <AuthFormGroup>
                <p>Уже есть аккаунт?</p>
                <Link to="/sign-in">Войдите здесь</Link>
              </AuthFormGroup>
            )}
          </AuthFormModalBlock>
        </AuthFormModal>
      </SAuthForm>
    </>
  );
};

export default AuthForm;
