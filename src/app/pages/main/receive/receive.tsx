import React, { useState, useRef } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { Button } from '@pages/shared';
import { setView, View, $userPkey } from '@state/shared';

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
  margin-top: 35px;
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

const Receive = () => {
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
        <Button color="receive" onClick={handleCopyClick}>copy and clode</Button>
      </Content>
    </Container>
  );
};

export default Receive;
