import React, { useEffect } from 'react';
import { $view, View } from '@state/shared';
import { Connect, Balance, Send, Receive } from '@pages/main';

const ROUTES = {
  [View.CONNECT]: Connect,
  [View.BALANCE]: Balance,
  [View.SEND]: Send,
  [View.RECEIVE]: Receive
};

export const getCurrentView = (view: View) => {
  return ROUTES[view];
};
