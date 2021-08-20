import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { 
  setView, View, 
  $ethBalance,
  $usdtBalance,
  $income
} from '@state/shared';
import { BalanceCard, Button, Table } from '@pages/shared';
import { isNil } from '@core/utils';

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
`;

const receiveButton = css`
    margin-left: 20px;
`;

const handleSendClick: React.MouseEventHandler = () => {
  setView(View.SEND);
};

const handleReceiveClick: React.MouseEventHandler = () => {
    setView(View.RECEIVE);
};

const BalanceFilled = () => {
  const ethBalance = useStore($ethBalance) / Math.pow(10, 18);
  const usdtBalance = useStore($usdtBalance) / Math.pow(10, 8);
  
  const data = useStore($income);
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
      fn: (value: string) => {
        return parseInt(value) / Math.pow(10, 8) + ' bUSDT';
      }
    },
    {
      name: 'status',
      title: 'Status'
    }
  ];

  return (
    <Container>
        {/* <Content>
            <BalanceCard type="usdt" balanceValue={usdtBalance}></BalanceCard>
            <BalanceCard type="eth" balanceValue={ethBalance}></BalanceCard>
        </Content> */}
        <StyledControls>
            <Button color="send" onClick={handleSendClick}>send</Button>
            <span className={receiveButton}>
                <Button color="receive" onClick={handleReceiveClick}>receive</Button>
            </span>
        </StyledControls>
        <StyledTable>
          <Table config={TABLE_CONFIG} data={data} keyBy='MsgId'/>
        </StyledTable>
    </Container>
  );
};

export default BalanceFilled;
