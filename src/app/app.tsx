import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import { $view } from '@state/shared';
import { getCurrentView } from '@core/router';
import { initApp } from '@state/init';

import './styles';

const App = () => {
  useEffect(() => {
    initApp();
  }, []);

  const view = useStore($view);
  const ViewComponent = getCurrentView(view);

  return (
      <ViewComponent />
  );
};

export default App;
