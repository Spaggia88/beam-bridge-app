import React, { useState, useRef } from 'react';
import { styled } from '@linaria/react';
import { Button, Window } from '@app/shared/components';
import { css } from '@linaria/core';
import { CURRENCIES, ROUTES } from '@app/shared/constants';
import { IconCancel, IconCopyWhite, IconDai, IconEth, IconUsdt, IconWbtc } from '@app/shared/icons';
import { useEffect } from 'react';
import { LoadPublicKey } from '@app/core/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { call, put, takeLatest, select } from 'redux-saga/effects';

interface DropdownProps {
  isVisible: boolean
}

interface BackDropProps {
  onCancel?: React.MouseEventHandler;
}

interface CopyAreaProps {
  onCopy?: any;
}

const BackdropStyled = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const BackDrop: React.FC<BackDropProps> = ({
  onCancel,
  children,
}) => {
  const rootRef = useRef();

  const handleOutsideClick = (event) => {
    if (event.target === rootRef.current) {
      onCancel(event);
    }
  };

  return (
    <BackdropStyled ref={rootRef} onClick={handleOutsideClick}>
      { children }
    </BackdropStyled>
  );
};

const Selector = (data: {type: string, onCurrChange: (next) => void, onPkChanged: (pk) => void}) => {
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(CURRENCIES);
  const toggleDropdown = () => setOpen(!isOpen);
  const [selectedCurrency, setCurr] = useState(items[0]);
  
  useEffect(()=>{
    setCurr(items[0])
    data.onCurrChange(items[0]);
    LoadPublicKey(null, items[0].cid).then((pk) => {
      data.onPkChanged(pk);
    });
  }, [])
  
  const handleItemClick = async (item) => {
    setCurr(item);
    data.onCurrChange(item);
    const pk = await LoadPublicKey(null, item.cid);
    data.onPkChanged(pk);
    setOpen(false);
  }

  const StyledDropdown = styled.div`
    margin-top: 20px;
  `;

  const DropdownElem = styled.div`
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 234px;
    height: 55px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 15px 24px;
  `;

  const DropdownElemOption = styled.div`
    font-size: 16px;
    padding: 8px 0;
    cursor: pointer;
    font-size: 16px;
    letter-spacing: 0.4px;
    display: flex;
    align-items: center;
  `;

  const DropdownBody = styled.div<DropdownProps>`
    z-index: 100;
    width: 234px;
    border-radius: 10px;
    position: absolute;
    background-color: #1c3a59;
    margin-top: 10px;
    padding: 12px 24px;
    display: ${({ isVisible }) => `${isVisible ? 'block' : 'none'}`};
  `;

  const Triangle = styled.div`
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #8da1ad;
    margin-left: auto;
  `;

  const CurrencyClass = css`
    line-height: 1;
    margin-left: 16px;
  `;
  
  const ICONS = {
    'bUSDT': () => <IconUsdt/>,
    'bWBTC': () => <IconWbtc/>,
    'bDAI': () => <IconDai/>,
    'bETH': () => <IconEth/>,
  };

  return data.type === 'amount' ? (
    <StyledDropdown>
      <DropdownElem onClick={toggleDropdown}>
        {ICONS[selectedCurrency.name]()}
        <span className={CurrencyClass}>{selectedCurrency.name}</span>
        <Triangle></Triangle>
      </DropdownElem>
      {
        isOpen ? 
        <>
          <DropdownBody isVisible={isOpen} className={`dropdown-body ${isOpen && 'open'}`}>
            {items.map(item => (
              <DropdownElemOption key={item.id} onClick={e => handleItemClick(item)}>
                {ICONS[item.name]()}
                <span className={CurrencyClass}>{item.name}</span>
              </DropdownElemOption>
            ))}
          </DropdownBody>
          <BackDrop onCancel={()=>setOpen(false)}/>
        </> : null
      }
    </StyledDropdown>
  ) : (<></>);
}

const OrSeparator: React.FC<BackDropProps> = ({}) => {
  const StyledOrSeparator = styled.span`
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  `;

  const Text = styled.span`
    font-size: 16px;
    font-style: italic;  
    color: rgba(255, 255, 255, 0.7);
  `;

  const Line = styled.span`
    height: 1px;
    width: 202px;
    background-color: rgba(255, 255, 255, 0.1);
  `;

  return (
    <StyledOrSeparator>
      <Line/>
      <Text>or</Text>
      <Line/>
    </StyledOrSeparator>
  );
};

const CopyArea: React.FC<CopyAreaProps> = ({
  onCopy,
  children,
}) => {
  const StyledArea = styled.div`
    padding: 8px 10px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    margin-top: 10px;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    max-width: 480px;
  `;

  const Content = styled.div`
    margin-right: 20px;
    font-size: 14px;
    font-style: italic;
    color: #b7c1cb;
    max-width: 424px;
    word-break: break-word;
  `;

  const CopyClass = css`
    cursor: pointer;
  `;

  const handleCopyClick = () => {
    const dataToCopy = onCopy();
    const el = document.createElement('textarea');
    el.value = dataToCopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  return (
    <StyledArea>
      <Content>{children}</Content>
      <IconCopyWhite className={CopyClass} onClick={handleCopyClick}/>
    </StyledArea>
  );
};

const ReceiveStyled = styled.div`
  width: 580px;
  margin: 0 auto !important;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 4px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 50px;
  margin-top: 32px;
`;

const Subtitle = styled.div`
  opacity: 0.7;
  font-size: 16px;
  font-style: italic;
  text-align: center;
`;

const StyledSeparator = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  margin-top: 50px;
  margin-bottom: 40px;
`;

const ContainerLine = styled.p`
  color: rgba(255, 255, 255, .7);
  font-size: 16px;
  font-style: italic;
`;

const BoldClass = css`
  font-weight: bold;
`;

const IndentClass = css`
  margin-top: 20px;
`;

const SmallIndentClass = css`
  margin-top: 10px;
`;

const pTitle = css`
  color: rgba(255, 255, 255, 1) !important;
  font-weight: bold;
`;

const LinkClass = css`
  color: #00f6d2;
  text-decoration: none;
  font-weight: bold
  margin-left: 4px;
`;

const CancelButtonClass = css`
  margin-top: 30px !important;
  margin-bottom: 50px !important;
  max-width: 133px !important;
`;

const Receive = () => {
  const [pKey, setPk] = useState('');
  const [selectedCurrency, setCur] = useState(null);
  const navigate = useNavigate();

  const getFullLink = () => {
    return selectedCurrency ? 'https://bridges-dappnet.web.app/send/' + (selectedCurrency.name.toLowerCase() + pKey) : '';
  }

  const pkChanged = (pk) => {
    setPk(pk);
  }

  const currChanged = (curr) => {
    setCur(curr);
  }

  const cancelClicked = () => {
    navigate(ROUTES.MAIN.MAIN_PAGE);
  }

  return (
    <Window>
      <ReceiveStyled>
        <Title>
          ETHEREUM TO BEAM
        </Title>
        <Container>
          <Subtitle>Choose currency</Subtitle>
          <Selector onCurrChange={currChanged} onPkChanged={pkChanged} type="amount"></Selector>
          <StyledSeparator/>
          <div>
            <ContainerLine>
              In order to transfer from Ethereum to Beam network, do <span className={BoldClass}>ONE</span> of the following:
            </ContainerLine>
            <ContainerLine className={IndentClass}>
              1. <span className={pTitle}> Automatic way (recommended) </span>
            </ContainerLine>
            <ContainerLine>
              Click to open 
              <a href={getFullLink()} className={LinkClass} target="_blank"> 
                Ethereum side of the bridge
              </a> in your web browser 
              (your Beam bridge address will be pasted automatically)
            </ContainerLine>
            <OrSeparator/>
            <ContainerLine className={IndentClass}>
              2. <span className={pTitle}> Manual way </span>
            </ContainerLine>
            <ContainerLine>
              - Copy and open <span className={pTitle}>Ethereum side of the brige </span> 
              manually in your web browser (your Beam bridge address will be pasted automatically)
            </ContainerLine>
            <CopyArea onCopy={()=> getFullLink()}> {getFullLink()} </CopyArea>
            <OrSeparator/>
            <ContainerLine className={IndentClass}>
              2. <span className={pTitle}> Сompletely manual way </span>
            </ContainerLine>
            <ContainerLine>
              - Copy and open <span className={pTitle}>Ethereum side of the brige </span> manually in your web browser
            </ContainerLine>
            <CopyArea onCopy={()=> 'https://bridges-dappnet.web.app/send/'}> {'https://bridges-dappnet.web.app/send/'} </CopyArea>
            <ContainerLine className={SmallIndentClass}>
              - Select <span className={pTitle}> Ethereum to Beam</span>
            </ContainerLine>
            <ContainerLine>
              - Copy and paste this address to the Beam bridge address field
            </ContainerLine>
            {selectedCurrency &&
            <CopyArea onCopy={()=> (selectedCurrency.name.toLowerCase() + pKey)}> {selectedCurrency.name.toLowerCase() + pKey} </CopyArea>
            }
          </div>
        </Container>
        <Button variant="ghost" 
        onClick={cancelClicked} 
        className={CancelButtonClass} 
        pallete="purple" 
        icon={IconCancel}> close</Button>
      </ReceiveStyled>
      
    </Window>
  );
};

export default Receive;
