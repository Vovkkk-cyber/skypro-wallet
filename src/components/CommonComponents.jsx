import styled from 'styled-components';

// Общий компонент для полей ввода
export const Input = styled.input`
  display: block;
  width: 280px;
  height: 39px;
  padding: 12px;
  margin: 0 0 15px 20px;
  border: 0.5px solid #999999;
  border-radius: 6px;
  background: transparent;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  transition: all 0.3s ease;
  &:focus {
    background: ${props => (props.$valid ? '#e6f3e6' : '#fff')};
    border-color: ${props => (props.$valid ? '#1FA46C' : '#999999')};
    outline: none;
  }
`;

// Общий компонент для кнопок
export const Button = styled.button`
  width: ${props => (props.$fullWidth ? '280px' : 'auto')};
  height: 39px;
  border-radius: 6px;
  padding: 12px;
  background: ${props => (props.$variant === 'primary' ? '#1FA46C' : props.$variant === 'secondary' ? '#fff' : 'none')};
  color: ${props => (props.$variant === 'primary' ? '#fff' : '#333')};
  border: ${props => (props.$variant === 'secondary' ? '0.5px solid #999999' : 'none')};
  font-family: 'Montserrat', sans-serif;
  font-weight: ${props => (props.$variant === 'primary' ? '600' : '400')};
  font-size: 12px;
  line-height: 100%;
  text-align: center;
  cursor: pointer;
  margin: ${props => (props.$fullWidth ? '15px 0 0 20px' : '0 0 0 20px')};
  transition: all 0.3s ease;
  &:hover {
    background: ${props =>
      props.$variant === 'primary' ? '#16905A' : props.$variant === 'secondary' ? '#f5f5f5' : '#e0e0e0'};
    color: ${props => (props.$variant !== 'primary' ? '#1FA46C' : '#fff')};
  }
`;

// Общий компонент для сообщений об ошибках
export const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
  margin-left: 20px;
  font-family: 'Montserrat', sans-serif;
`;