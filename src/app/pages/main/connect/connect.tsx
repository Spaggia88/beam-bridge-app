import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';

const ONBOARD_TEXT = 'CONNECT WALLET';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin-top: 240px
  font-size: 56px;
  font-weight: 900;
`;

const Subtitle = styled.h2`
  margin-top: 32px;
  font-size: 24px;
`;

const connectButton = css`
  margin-top: 80px;
  cursor: pointer;
  border: none;
  padding: 16px 40px;
  border-radius: 50px;
  background-color: #fff;
`;

const connectButtonText = css`
  font-size: 16px;
  font-weight: bold;
  color: #032e49;
`;

const Connect = () => {
  const [active, setActive] = useState(null);
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);

  const onClick = () => {
  };

  return (
    <Container>
      <Title>ETH to BEAM Bridge</Title>
      <Subtitle>Send funds through BEAM Smart Contract</Subtitle>
      <button className={connectButton} disabled={isDisabled} onClick={onClick}>
        <span className={connectButtonText}>{buttonText}</span>
      </button>
    </Container>
  );
};

export default Connect;
