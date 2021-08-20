import React, { useState, useRef, HTMLAttributes } from 'react';
import { styled } from '@linaria/react';
import { isNil } from '@core/utils';
import { setCurrency, currencies } from '@state/send';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  type: 'amount' | 'common'
}

interface DropdownProps {
  isVisible: boolean
}

const ContainerStyled = styled.div`
  margin-top: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, .05);
  border-radius: 10px;
  width: 100%;
  height: 59px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 15px;
`;

const InputStyled = styled.input<InputProps>`
  line-height: 20px;
  border: none;
  font-size: ${({ type }) => `${type === 'common' ? '16px' : '36px'}`};
  color: ${({ type }) => `${type === 'common' ? 'white' : '#da68f5'}`};
  background-color: transparent;
  width: ${({ type }) => `${type === 'common' ? '100%' : '90%'}`};
  height: 100%;

  // &::placeholder {
  //   position: absolute;
  //   top: 0;
  //   left: 3px;
  //   line-height: inherit;
  //   color: white;
  //   opacity: 0.5;
  // }
`;

// const ErrorStyled = styled.div`
//   position: absolute;
//   top: 33px;
//   left: 0;
//   line-height: 26px;
//   font-size: 13px;
//   color: var(--color-failed);
// `;

const Selector = (data: {type: string}) => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(currencies);
  const [selectedItem, setSelectedItem] = useState(items[0]);
  
  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrency(item);
    setOpen(false);
  }

  const StyledDropdown = styled.div`
    margin-left: auto;
  `;

  const DropdownElem = styled.div`
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 20px;
  `;

  const DropdownElemOption = styled.div`
    font-size: 16px;
    padding: 10px;
    cursor: pointer;
  `;

  const DropdownBody = styled.div<DropdownProps>`
    position: absolute;
    background-color: rgba(11, 204, 247, 0.5);
    display: ${({ isVisible }) => `${isVisible ? 'block' : 'none'}`};
  `;

  return data.type === 'amount' ? (
    <StyledDropdown>
      <DropdownElem onClick={toggleDropdown}>
        {selectedItem ? items.find(item => item.id == selectedItem.id).name : ""}
      </DropdownElem>
      <DropdownBody isVisible={isOpen} className={`dropdown-body ${isOpen && 'open'}`}>
        {items.map(item => (
          <DropdownElemOption key={item.id} onClick={e => handleItemClick(item)}>
            {/* <span className={`${item.id == selectedItem.id && 'selected'}`}>• </span> */}
            {item.name}
          </DropdownElemOption>
        ))}
      </DropdownBody>
    </StyledDropdown>
  ) : (<></>);
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, error, ...rest }, ref) => (
    <ContainerStyled>
      <InputStyled type={type} ref={ref} error={error} {...rest} />
      <Selector type={type}/>
    </ContainerStyled>
  ),
);

export default Input;
