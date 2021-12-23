import React, { useState, useRef } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { Button, Input } from '@pages/shared';
import { setView, View } from '@state/shared';
import { $selectedCurrency } from '@state/send';
import { send } from '@state/init';
import AppCore from '@core/AppCore';
import { css } from '@linaria/core';

import { IconCancel } from '@app/icons';

const SendStyled = styled.div`
  width: 580px;
  margin: 30px auto !important;
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
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  margin-top: 30px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 50px 20px;
  margin-top: 20px;
`;

const ContainerLine = styled.p`
  color: rgba(255, 255, 255, .7);
  font-size: 16px;
  font-style: italic;
  display: flex;
  flex-direction: row;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 3.11px;
`;

const EnsureField = styled.p`
  opacity: 0.5;
  font-size: 14px;
  font-style: italic;
  letter-spacing: 0.26px;
  margin-left: 15px;
  margin-top: 10px;
`;

const InfoList = styled.div`
  margin-left: 15px;
  line-height: 1.88;
  margin-top: 20px;
`;

const Number = styled.span`
  width: 25px;
`;

const Text = styled.span`
  max-width: 480px;
  word-break: break-word;
`;

const LinkClass = css`
  color: #00f6d2;
  text-decoration: none;
  font-weight: bold
  margin-left: 4px;
`;

const CancelButtonClass = css`
  max-width: 133px !important;
`;

const pTitle = css`
  color: rgba(255, 255, 255, 1) !important;
  font-weight: bold;
`;


const Send = () => {
  const addressInputRef = useRef<HTMLInputElement>();
  const amountInputRef = useRef<HTMLInputElement>();
  const feeInputRef = useRef<HTMLInputElement>();
  const [feeVal, setFeeVal] = useState(0);
  const [address, setAddress] = useState(null);
  const selectedCurrency = useStore($selectedCurrency);
  //const calcValue = await AppCore.calcSomeFee(selectedCurrency.rate_id);
  //setFee(123)
  
  const handleBackClick: React.MouseEventHandler = () => {
    setView(View.BALANCE);
  };

  const getFee = async () => {
    return await AppCore.calcSomeFee(selectedCurrency.rate_id);
  }

  getFee().then((data) => {
    feeInputRef.current.value = data.toFixed(selectedCurrency.decimals)
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const address = data.get('address') as string;
    const amount = parseFloat(data.get('amount') as string);
    const fee = parseFloat(data.get('fee') as string);

    const sendData = {
      amount, 
      address: address.replace('0x',''), 
      fee,
      decimals: selectedCurrency.decimals 
    };
    console.log('Send info: ', sendData)
    
    send(sendData, selectedCurrency.cid);
    setView(View.BALANCE);
  }

  const cancelClicked = () => {
    setView(View.BALANCE)
  }

  const inputChange = (event) => {
    let value = event.target.value;
    setAddress(value);
  }

  return (
    // <Container>
    //   <Title>Send</Title>
    //   <FormStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
    //     <FormSubtitle>ETH WALLET ADDRESS</FormSubtitle>
    //     
    //     <FormSubtitle>AMOUNT</FormSubtitle>
    //     <Input variant='amount' ref={amountInputRef} name="amount"></Input>
    //     <FormSubtitle>FEE</FormSubtitle>
    //     <Input variant='fee' ref={feeInputRef} name="fee"></Input>
        
    //     <SendStyled>
    //       <Cancel type="button" color="cancel" onClick={handleCancelClick}>cancel</Cancel>
    //       <Button color="send">send</Button>
    //     </SendStyled>
    //   </FormStyled>
    // </Container>
    <SendStyled>
      <Title>
        BEAM TO ETHEREUM
      </Title>
      <Container>
        <Subtitle>ETHEREUM BRIDGE ADDRESS</Subtitle>
        <Input placeholder="Paste Ethereum bridge address here"
          onChange={ inputChange }
          variant="common" ref={addressInputRef} name="address"/>
        <EnsureField>Ensure the address matches the Ethereum network to avoid losses</EnsureField>
      </Container>

      { address ? 
        (<></>) : 
        (<InfoContainer>
          <ContainerLine>
            In order to transfer from Beam to Ethereum network, do the following:
          </ContainerLine>
          <InfoList>
            <ContainerLine>
              <Number>1.</Number>
              <Text>
              <a href="https://bridge-ethapp.web.app" className={LinkClass} target="_blank"> 
                Ethereum side of the bridge
              </a> in your web browser</Text>
            </ContainerLine>
            <ContainerLine>
              <Number>2.</Number>
              <Text>Connect your Metamask wallet</Text>
            </ContainerLine>
            <ContainerLine>
              <Number>3.</Number>
              <Text>Choose <span className={pTitle}>Beam to Ethereum </span> 
              and follow instructions to obtain Ethereum bridge address</Text>
            </ContainerLine>
            <ContainerLine>
              <Number>4.</Number>
              <Text>Get back to this screen and paste the address</Text>
            </ContainerLine>
          </InfoList>
        </InfoContainer>)
      }
      <SendStyled>
        <Button variant="ghost" 
        onClick={cancelClicked} 
        pallete="purple" 
        className={CancelButtonClass}
        icon={IconCancel}> cancel</Button>
        {/* <Button color="send">send</Button> */}
       </SendStyled>
    </SendStyled>
  );
};

export default Send;
