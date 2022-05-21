import React from 'react';
import ReactDOM from 'react-dom';
import {storageManager} from './globals.js';
import './index.css';
import './scrollbars.js';
import App from './components/App';
import BackupManager from './components/BackupManager.js';
import OAuthManager from './libs/OAuthManager';
import * as serviceWorker from './serviceWorker';

const oauthManager = new OAuthManager(storageManager);
const backupManager = new BackupManager(storageManager);

ReactDOM.render(
  <React.StrictMode>
    <App oauthManager={oauthManager} backupManager={backupManager} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
