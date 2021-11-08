import React, { useState, useRef } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { Button, Input } from '@pages/shared';
import { setView, View } from '@state/shared';
import { $selectedCurrency } from '@state/send';
import { send } from '@state/init';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 14px;
  letter-spacing: 4px;
`;

const ControlStyled = styled.div`
  width: 600px;
  margin: 20px auto;
  flex-direction: row;
  display: flex;
`;

const BackControl = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
`;

const BackControlIcon = styled.object`
  display: block;
  margin-right: 15px;
`;

const BackControlText = styled.p`
  opacity: .3;
  font-size: 14px;
  font-weight: bold;
`;

const FormStyled = styled.form`
  width: 600px;
  margin-top: 30px;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  background-color: rgba(13, 77, 118, .9);
  padding: 0 20px;
  padding-bottom: 30px;
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  align-self: center;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-top: 30px;
`;

const SendStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 20px;
  margin-top: 50px;
`;

const handleBackClick: React.MouseEventHandler = () => {
  setView(View.BALANCE);
};

const Cancel = styled.button`
  margin-right: 20px;
  display: block;
  padding: 10px 30px;
  border: none;
  border-radius: 50px;
  background-color: var(--color-cancel)};
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;

  &:hover,
  &:active {
    box-shadow: 0 0 8px white;
  }
`;

const Send = () => {
  const addressInputRef = useRef<HTMLInputElement>();
  const amountInputRef = useRef<HTMLInputElement>();
  const feeInputRef = useRef<HTMLInputElement>();
  
  const currency = useStore($selectedCurrency);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const address = data.get('address') as string;
    const amount = parseFloat(data.get('amount') as string);
    const fee = parseFloat(data.get('amount') as string);
    
    send(amount, address.replace('0x',''), fee);
    setView(View.BALANCE);
  }

  const handleCancelClick = (event) => {
    event.preventDefault();
    setView(View.BALANCE);
  }

  return (
    <Container>
      <Title>Send</Title>
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
      <FormStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
        <FormSubtitle>ETH WALLET ADDRESS</FormSubtitle>
        <Input type='common' ref={addressInputRef} name="address"></Input>
        <FormSubtitle>AMOUNT</FormSubtitle>
        <Input type='amount' ref={amountInputRef} name="amount"></Input>
        <FormSubtitle>FEE</FormSubtitle>
        <Input type='fee' ref={feeInputRef} name="fee"></Input>
        
        <SendStyled>
          <Cancel type="button" color="cancel" onClick={handleCancelClick}>cancel</Cancel>
          <Button color="send">send</Button>
        </SendStyled>
      </FormStyled>
    </Container>
  );
};

export default Send;
