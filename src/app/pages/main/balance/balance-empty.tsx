import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { 
  setView, View,
  
} from '@state/shared';
import { Button } from '@pages/shared';
import { isNil } from '@core/utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
`;

const Title = styled.h1`
  opacity: 0.5;
  font-size: 24px;
`;

const StyledControls = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: row;
`;

const handleReceiveClick: React.MouseEventHandler = () => {
  setView(View.RECEIVE);
};

const BalanceEmpty = () => {
  
  return (
    <Container>
        <Title> Уour balance is empty</Title>
        <StyledControls>
            <Button color="receive" onClick={handleReceiveClick}>receive</Button>
        </StyledControls>
    </Container>
  );
};

export default BalanceEmpty;
