import { SButton } from "./SButton.styled";

const Button = ({ isActive = true, children }) => {
  return <SButton $isActive={isActive}>{children}</SButton>;
};

export default Button;
