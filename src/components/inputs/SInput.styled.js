import styled from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 12px;
`;

export const SInput = styled.input`
  width: 100%;
  min-width: 100%;
  height: 39px;
  padding: 12px;
  outline: none;
  box-sizing: border-box;
  border: ${(props) => {
    switch (props.$statusInput) {
      case "correct":
        return "0.5px solid rgb(31, 164, 108)";
      case "error":
        return "0.5px solid rgb(242, 80, 80)";
      default:
        return "0.5px solid rgb(153, 153, 153)";
    }
  }};
  border-radius: 6px;
  color: ${(props) => {
    switch (props.$statusInput) {
      case "error":
        return "rgb(242, 80, 80)";
      default:
        return "inherit";
    }
  }};
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  background-color: ${(props) => {
    switch (props.$statusInput) {
      case "correct":
        return "rgb(219, 255, 233)";
      case "error":
        return "rgb(255, 235, 235)";
      default:
        return "transparent";
    }
  }};

  &::placeholder {
    color: rgb(153, 153, 153);
    font-family: Montserrat;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
  }
`;
