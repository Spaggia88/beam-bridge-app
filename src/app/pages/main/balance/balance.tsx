import React from 'react';
import { useStore } from 'effector-react';

import { $phase } from '@state/balance';
import { BalancePhase } from '@state/balance';

import BalanceEmpty from './balance-empty';
import BalanceFilled from './balance-filled';


function getLoginComponent(phase: BalancePhase) {
  switch (phase) {
    case BalancePhase.EMPTY:
      return BalanceEmpty;
    case BalancePhase.FILLED:
      return BalanceFilled;
    default:
      return BalanceEmpty;
  }
}

const Login: React.FC = () => {
  const phase = useStore($phase);
  const Component = getLoginComponent(phase);
  return <Component />;
};

export default Login;
