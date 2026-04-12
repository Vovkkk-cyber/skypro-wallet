import { Link } from "react-router-dom";
import styled from "styled-components";
import { Logo } from "../components/Header";
import { LogoIcon } from "../components/Icons";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Content = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;

  h2,
  p {
    font-family: "Montserrat", sans-serif;
  }
`;

const NavButton = styled(Link)`
  text-decoration: ${(props) => (props.active ? "underline" : "none")};
  color: #333;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #1fa46c;
    font-weight: 600;
    text-decoration: underline;
  }
`;

const NotFoundPage = () => {
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
      <Container>
        <Content>
          <h2>404 - Страница не найдена</h2>
          <p>К сожалению, запрашиваемая страница не существует.</p>
          <NavButton to="/">Вернуться на главную</NavButton>
        </Content>
      </Container>
    </>
  );
};

export default NotFoundPage;
