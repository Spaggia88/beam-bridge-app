import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Button, CurrInput, Rate, Window } from '@app/shared/components';
import { css } from '@linaria/core';

import { IconCancel, IconSend } from '@app/shared/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@app/shared/constants';
import { SendTo } from '@core/api';
import { useFormik } from 'formik';
import ethereum_address from 'ethereum-address';
import { useSelector } from 'react-redux';
import { selectFees } from '../../store/selectors';

interface SendFormData {
  send_amount: string;
  address: string;
}

const SendStyled = styled.form`
  width: 580px;
  margin: 0 auto !important;
`;

const ControlsStyled = styled.div`
  margin: 30px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
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

const RateStyleClass = css`
  font-size: 12px;
  align-self: start;
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
  margin: 0 !important;
`;

const TransferButtonClass = css`
  max-width: 141px !important;
  margin: 0 0 0 20px !important;
`;

const pTitle = css`
  color: rgba(255, 255, 255, 1) !important;
  font-weight: bold;
`;

const SendClass = css`
  height: 55px !important;
`;

const AmountContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  margin-top: 20px;
`;

const FeeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const FeeItem = styled.div`
`;

const FeeValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #da68f5;
  margin-top: 10px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-top: 30px;
  letter-spacing: 3.11px;
  color: rgba(255, 255, 255, 0.5);
`;

const FeeSubtitleClass = css`
  margin-top: 0 !important;
`;

const Send = () => {
  const navigate = useNavigate();
  const addressInputRef = useRef<HTMLInputElement>();
  const amountInputRef = useRef<HTMLInputElement>();
  const relayerFees = useSelector(selectFees());
  const [address, setAddress] = useState(null);
  const [selectedCurrency, setCurrency] = useState(null);

  const validate = async (formValues: SendFormData) => {
    const errorsValidation: any = {};
    const {
        send_amount,
        address
    } = formValues;

    if (send_amount == '' || parseFloat(send_amount) == 0) {
      errorsValidation.send_amount = `Insufficient amount`;
    }

    const regex = new RegExp('^[A-Za-z0-9]+$');
    if (!regex.test(address) || !ethereum_address.isAddress(address)) {
      errorsValidation.address = `Unrecognized address`;
    }

    return errorsValidation;
  };

  const formik = useFormik<SendFormData>({
    initialValues: {
        send_amount: '',
        address: ''
    },
    isInitialValid: false,
    onSubmit: (value) => {
    
    },
    validate: (e) => validate(e),
  });

  const {
    values, setFieldValue, errors, submitForm, resetForm
  } = formik;

  const isFormDisabled = () => {
    if (!formik.isValid) return !formik.isValid;
    return false;
  };

  const currChanged = (newCurr) => {
    setCurrency(newCurr);
  }

  const isAddressValid = () => !errors.address;
  const isSendAmountValid = () => !errors.send_amount;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const address = data.get('address') as string;
    const amount = parseFloat(data.get('amount') as string);
    
    const sendData = {
      amount, 
      address: address.replace('0x',''), 
      fee: relayerFees[selectedCurrency.rate_id],
      decimals: selectedCurrency.decimals 
    };
    
    SendTo(sendData, selectedCurrency.cid);
    navigate(ROUTES.MAIN.MAIN_PAGE);
  }

  const cancelClicked = () => {
    navigate(ROUTES.MAIN.MAIN_PAGE);
  }

  const handleAddressChange = (address: string) => {
    setFieldValue('address', address, true);
    setAddress(address);
  }

  const handleAmountChange = (amount: string) => {
    setFieldValue('send_amount', amount, true);
  };

  return (
    <Window>
    <SendStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Title>
        BEAM TO ETHEREUM
      </Title>
      <Container>
        <Subtitle>ETHEREUM BRIDGE ADDRESS</Subtitle>
        <CurrInput placeholder="Paste Ethereum bridge address here"
          onChangeHandler={handleAddressChange}
          valid={isAddressValid()}
          value={values.address}
          label={errors.address}
          variant="common"
          ref={addressInputRef}
          name="address"/>
        <EnsureField>Ensure the address matches the Ethereum network to avoid losses</EnsureField>
      </Container>

      { address ? 
        (<AmountContainer>
          <Subtitle>AMOUNT</Subtitle>
          <CurrInput 
            onCurrChangeCb={ currChanged }
            className={SendClass}
            onChangeHandler={handleAmountChange}
            value={values.send_amount}
            valid={isSendAmountValid()}
            label={errors.send_amount}
            variant='amount'
            ref={amountInputRef}
            name="amount"/>
          <FeeContainer>
            <FeeItem>
              <FormSubtitle className={FeeSubtitleClass}>RELAYER FEE</FormSubtitle>
              {selectedCurrency && relayerFees && <>
                <FeeValue>{relayerFees[selectedCurrency.rate_id]} {selectedCurrency.name}</FeeValue>
                <Rate value={relayerFees[selectedCurrency.rate_id]}
                  selectedCurrencyId={selectedCurrency.rate_id}
                  className={RateStyleClass} />
              </>}
            </FeeItem>
            <FeeItem>
              <FormSubtitle className={FeeSubtitleClass}>TRANSACTION FEE</FormSubtitle>
              <FeeValue>{0.011} BEAM</FeeValue>
              <Rate value={0.011}
                  selectedCurrencyId={'beam'}
                  className={RateStyleClass} />
            </FeeItem>
          </FeeContainer>
        </AmountContainer>) : 
        (<InfoContainer>
          <ContainerLine>
            In order to transfer from Beam to Ethereum network, do the following:
          </ContainerLine>
          <InfoList>
            <ContainerLine>
              <Number>1.</Number>
              <Text>
              <a href="https://bridges-dappnet.web.app" className={LinkClass} target="_blank"> 
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
      <ControlsStyled>
        <Button variant="ghost" 
        onClick={cancelClicked} 
        pallete="purple" 
        className={CancelButtonClass}
        icon={IconCancel}> close</Button>
        { address ? 
          (<Button type="submit" 
            disabled={isFormDisabled()} 
            icon={IconSend}
            className={TransferButtonClass}
            pallete="purple" 
            variant="regular">transfer</Button>) : 
          (<></>) 
        }
      </ControlsStyled>
    </SendStyled>
    </Window>
  );
};

export default Send;
