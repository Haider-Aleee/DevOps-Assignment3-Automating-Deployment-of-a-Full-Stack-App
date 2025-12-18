import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App cartId={777} />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
