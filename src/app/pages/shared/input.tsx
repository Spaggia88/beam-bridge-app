import React, { useState, useRef, HTMLAttributes } from 'react';
import { styled } from '@linaria/react';
import { setCurrency, $selectedCurrency} from '@state/send';
import { currencies } from '@core/types';
import { useStore } from 'effector-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  variant: 'amount' | 'common' | 'fee',
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
  font-size: ${({ variant }) => `${variant === 'common' ? '16px' : '36px'}`};
  color: ${({ variant }) => `${variant === 'common' ? 'white' : '#da68f5'}`};
  background-color: transparent;
  width: ${({ variant }) => `${variant === 'common' ? '100%' : '90%'}`};
  height: 100%;
  -moz-appearance:textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

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
  const selectedCurrency = useStore($selectedCurrency);

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
    display: flex;
    flex-direction: row;
    align-items: center;
  `;

  const DropdownElemOption = styled.div`
    font-size: 16px;
    padding: 10px;
    cursor: pointer;
  `;

  const DropdownBody = styled.div<DropdownProps>`
    z-index: 100;
    position: absolute;
    background-color: rgba(11, 204, 247);
    display: ${({ isVisible }) => `${isVisible ? 'block' : 'none'}`};
  `;

  const Triangle = styled.div`
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #8da1ad;
    margin-left: 5px;
  `;

  return data.type === 'amount' ? (
    <StyledDropdown>
      <DropdownElem onClick={toggleDropdown}>
        {selectedCurrency.name}
        <Triangle></Triangle>
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
  ) : (data.type === 'fee' ? (<StyledDropdown>
    <DropdownElem>
      {selectedCurrency.name}
    </DropdownElem>
  </StyledDropdown>) : <></>);
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, error, ...rest }, ref) => {
    const selectedCurrency = useStore($selectedCurrency);

    const inputChange = (event) => {
      let value = event.target.value;
      var regex = new RegExp("^\\d*(\\.?\\d{0," + selectedCurrency.decimals + "})", "g");
      value = (value.match(regex)[0]) || null;
      event.target.value = value;
    }

    return (<ContainerStyled>
      <InputStyled
        variant={variant} ref={ref} 
        onChange={variant === 'amount' || variant === 'fee' ? inputChange : null}
        type={variant === 'amount' || variant === 'fee' ? 'number' : 'text'}
        error={error} {...rest} />
      <Selector type={variant}/>
    </ContainerStyled>);
  },
);

export default Input;
