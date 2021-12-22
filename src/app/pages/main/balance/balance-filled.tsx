import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { 
  setView, View,
  $transactions, $ready
} from '@state/shared';
import { Button, Table } from '@pages/shared';
import { currencies, Transaction } from '@app/core/types';
import { IconReceive, IconSend } from '@app/icons';

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

const handleSendClick: React.MouseEventHandler = () => {
  setView(View.SEND);
};

const handleReceiveClick: React.MouseEventHandler = () => {
  setView(View.RECEIVE);
};

const BalanceFilled: React.FC<any> = () => {
  //const ethBalance = useStore($ethBalance) / Math.pow(10, 18);
  //const usdtBalance = useStore($usdtBalance) / Math.pow(10, 8);
  const ready = useStore($ready);
  const data = useStore($transactions);
//   const [data, setData] = useState(null);

//   $income.watch(value => {
//     console.log('watch:',value);
//     if (!isNil(value) && value.length > 0) {
//         console.log('watched');
//       data = value;
//     }
//   });

  const TABLE_CONFIG = [
    {
      name: 'amount',
      title: 'Amount',
      fn: (value: string, tr: Transaction) => {
        const curr = currencies.find((item) => item.cid === tr.cid);

        return parseInt(value) / Math.pow(10, 8) + ' ' + curr.name;
      }
    },
    {
      name: 'status',
      title: 'Status'
    }
  ];

  return (
    ready ? (<Container>
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
          <Table config={TABLE_CONFIG} data={data} keyBy='MsgId'/>
        </StyledTable>
    </Container>) : null
  );
};

export default BalanceFilled;
