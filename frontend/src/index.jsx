import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes';
import './index.css';
import { StoreProvider } from './components/StoreProvider';

ReactDOM.render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="violet">
      <StoreProvider>
        <App />
      </StoreProvider>
    </Theme>
  </React.StrictMode>,
  document.getElementById('root'),
);
