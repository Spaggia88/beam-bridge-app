import React, { useEffect, useState } from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Window, Button, Table } from '@app/shared/components';
import { selectAppParams, selectBridgeTransactions, selectRate } from '../../store/selectors';
import { IconSend, IconReceive } from '@app/shared/icons';
import { CURRENCIES, ROUTES } from '@app/shared/constants';
import { BridgeTransaction } from '@core/types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
`;

const Content = styled.div`
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
`;

const ContentHeader = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const StyledControls = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: row;
`;

const StyledTable = styled.div`
  margin-top: 30px;
  border-radius: 10px;
  overflow: hidden;
`;

const receiveButtonClass = css`
    margin-left: 20px !important;
`;

const EmptyTableContent = styled.div`
  text-align: center;
  margin-top: 72px;
  font-size: 14px;
  font-style: italic;
  color: #8da1ad;
`;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rate = useSelector(selectRate());
  const bridgeTransactions = useSelector(selectBridgeTransactions());

  const TABLE_CONFIG = [
    {
      name: 'amount',
      title: 'Amount',
      fn: (value: string, tr: BridgeTransaction) => {
        const curr = CURRENCIES.find((item) => item.cid === tr.cid);

        return parseInt(value) / Math.pow(10, 8) + ' ' + curr.name;
      }
    },
    {
      name: 'status',
      title: 'Status'
    }
  ];

  const handleSendClick: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.SEND);
  };
  
  const handleReceiveClick: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.RECEIVE);
  };

  return (
    <>
      <Window>
        <Container>
          <StyledControls>
            <Button icon={IconSend}
            pallete="purple"
            onClick={handleSendClick}>
              beam to ethereum
            </Button>
            <Button icon={IconReceive}
            className={receiveButtonClass}
            pallete="blue"
            onClick={handleReceiveClick}>
              ethereum to beam
            </Button>
          </StyledControls>
          <StyledTable>
            <Table config={TABLE_CONFIG} data={bridgeTransactions} keyBy='MsgId'/>
            {bridgeTransactions.length === 0 && 
              <EmptyTableContent>There are no incoming transactions yet</EmptyTableContent>}
          </StyledTable>
        </Container>
      </Window>
    </>
  );
};

export default MainPage;
