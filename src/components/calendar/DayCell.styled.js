import styled from 'styled-components';

export const DayCell = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${({ $isSelected, $isInRange }) => 
    $isSelected ? '#CFF8E2' :
    $isInRange ? '#EAF9F1' : '#f5f5f5'};
  color: ${({ $isSelected }) => ($isSelected ? '#24A148' : '#000')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-size: 14px;

  &:hover {
    background: #e0f2e8;
  }
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
`;

export const EmptyDayCell = styled.div`
  width: 35px;
  height: 35px;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;