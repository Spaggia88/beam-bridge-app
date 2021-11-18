import React, { useState, useRef } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { Button } from '@pages/shared';
import { setView, View, $userPkey } from '@state/shared';
import { currencies } from '@core/types';
import AppCore from '@core/AppCore';
import { $selectedCurrency, setCurrency } from './model';

interface DropdownProps {
  isVisible: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 14px;
  letter-spacing: 4px;
`;

// const ControlStyled = styled.div`
//   width: 600px;
//   margin: 20px auto;
//   flex-direction: row;
//   display: flex;
// `;

// const BackControl = styled.div`
//   cursor: pointer;
//   display: flex;
//   flex-direction: row;
// `;

// const BackControlIcon = styled.object`
//   display: block;
//   margin-right: 15px;
// `;

// const BackControlText = styled.p`
//   opacity: .3;
//   font-size: 14px;
//   font-weight: bold;
// `;

const Content = styled.form`
  width: 580px;
  border-radius: 10px;
  background-color: rgba(13, 77, 118, .9);
  padding: 50px 20px;
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  align-items: center;
`;

const ContentTitle = styled.p`
  opacity: 0.7;
  font-size: 16px;
  font-style: italic;
`;

const PkeyValue = styled.p`
  font-size: 14px;
  line-height: 1.43;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const SendStyled = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;


const Selector = (data: {type: string}) => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(currencies);
  const [selectedItem, setSelectedItem] = useState(items[0]);
  
  const toggleDropdown = () => setOpen(!isOpen);
  const selectedCurrency = useStore($selectedCurrency);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrency(item);
    AppCore.loadPKey(item.cid);
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
  ) : (<></>);
}

const Receive = () => {
  AppCore.loadPKey(currencies[0].cid);
  const pKey = useStore($userPkey);

  const handleCopyClick: React.MouseEventHandler = () => {
    const el = document.createElement('textarea');
    el.value = pKey;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setView(View.BALANCE);
  };

  return (
    <Container>
      <Title>Receive</Title>
      {/* <ControlStyled>
        <BackControl onClick={handleBackClick}>
          <BackControlIcon
            type="image/svg+xml"
            data={'./assets/icon-back.svg'}
            width="16"
            height="16"
          ></BackControlIcon>
          <BackControlText>
            back
          </BackControlText>
        </BackControl>
      </ControlStyled> */}
      <Content>
        <ContentTitle>Сopy and send your bridge contract address to the sender</ContentTitle>
        <PkeyValue>{pKey}</PkeyValue>
        <Selector type="amount"></Selector>
        <Button color="receive" onClick={handleCopyClick}>copy and clode</Button>
      </Content>
    </Container>
  );
};

export default Receive;
