import './index.css';
import 'basscss/css/basscss.css';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import App from './App';

ReactModal.setAppElement('#root');

ReactDOM.render(<App />, document.getElementById('root'));
