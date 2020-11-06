import React from 'react';

import EditLine from './EditLine.js';
import Footer from './Footer.js';
import {storageManager} from './globals.js';
import GitHub from './GitHub.js';
import Head from './Head.js';
import Help from './Help.js';
import IDE from './IDE.js';
import Load from './Load.js';
import {isGistId, loadGistFromSrc} from './loader.js';
import {LogManager} from './Log.js';
import * as model from './model.js';
import OAuthManager from './OAuthManager.js';
import Save from './Save.js';
import ServiceContext from './ServiceContext.js';
import Settings from './Settings.js';
import UserManager from './UserManager.js';

import './App.css';

const backupKey = 'backup';
const noJSX = () => [];
const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      path: window.location.pathname,
      dark: darkMatcher.matches,
      loading: false,
      dialog: noJSX,
      gistId: '',
      messages: [],
      userData: {},
      updateVersion: 0,
    };
    this.github = new GitHub();
    this.logManager = new LogManager();
    this.oauthManager = new OAuthManager(storageManager);
    this.userManager = new UserManager({
      oauthManager: this.oauthManager,
      github: this.github,
      addError: this.addError,
    });
  }
  componentDidMount() {
    this.github.addEventListener('userdata', (e) => {
      this.setState({
        userData: e.data,
      });
    });
    model.add('path', window.location.pathname);
    model.subscribe('path', (newValue) => {
      window.history.pushState({}, '', newValue);
      this.setState({
        path: newValue,
      });
    });
    // I still am not sure how I'm supposed to handle this.
    // Putting my model in the state itself seems wrong
    // and doesn't actually help since I'd have to 
    // generate an entirely new state object to change any
    // nested property.
    //
    // Storing the data outside I see no way to tell
    // components to re-render except to call forceUpdate
    // which all the documentation says "if you call this
    // you're doing it wrong".
    //
    // Redux is a joke. 50 lines code needed to set
    // a single field. Repeat those 50 lines for every field.
    // Things like redux-tools make it less to type those
    // 50 lines but they still execute 50 to 500 lines of code
    // just to set a single value.
    model.subscribe(model.filesVersionKey, _ => {
      this.forceUpdate();
    });
    // this is a hack because I can't figure out how to
    // update the CodeMirror areas
    model.subscribe('updateVersion', _ => {
      this.setState({updateVersion: this.state.updateVersion + 1});
    });

    darkMatcher.addEventListener('change', () => {
      this.setState({dark: darkMatcher.matches});
    });

    const query = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const backup = storageManager.get(backupKey);
    let loaded = false;
    if (backup) {
      try {
        const data = JSON.parse(backup);
        if (data.href === window.location.href) {
          model.setData(data.data);
          const url = new URL(data.href);
          const {src} = Object.fromEntries(new URLSearchParams(url.search).entries());
          if (isGistId(src)) {
            this.setState({gistId: src, gistOwnerId: data.gistOwnerId});
          }
          loaded = true;
          this.addInfo('loaded backup from local storage')
        }
      } catch (e) {
        console.log('bad backup')
      }
      storageManager.delete(backupKey);
    }
    if (!loaded && query.src) {
      this.loadData(query.src);
    }
  }
  async loadData(src) {
    this.setState({loading: true});
    let success = true;
    try {
      const {data, id, rawData} = await loadGistFromSrc(src, this.github);
      model.setData(data);
      if (id) {
        this.setState({
          gistId: src,
          gistOwnerId: rawData?.owner?.id,
        });
      }
    } catch (e) {
      success = false;
      console.warn(e);
      this.addError(`could not load jsGist: src=${src} ${e}`);
    }
    this.setState({loading: false});
    if (success) {
      this.handleRun();
    }
  }
  addMsg = (msg, className) => {
    switch (className) {
      case 'error':
        console.error(msg);
        break;
      default:
        console.log(msg);
        break;
    }
    this.setState({messages: [{msg, className}, ...this.state.messages]});
    setTimeout(() => {
      this.setState({messages: this.state.messages.slice(0, this.state.messages.length - 1)});
    }, 5000);
  }
  addInfo = (msg) => this.addMsg(msg, 'info');
  addError = (msg) => this.addMsg(msg, 'error');
  closeDialog = () => {
    this.setState({dialog: noJSX});
  }
  registerRunnerAPI = (api) => {
    this.runnerAPI = api;
    this.handleStop();
  }
  handleNew = async() => {
    window.location.href = window.location.origin;
    //window.history.pushState({}, '', `${window.location.origin}`);
    //model.setData(model.getNewData());
  }
  handleRun = async () => {
    storageManager.set(backupKey, JSON.stringify({
      href: window.location.href,
      data: model.getData(),
      gistOwnerId: this.state.gistOwnerId,
    }));
    this.logManager.clear();
    console.clear();
    this.runnerAPI.run(model.getData());
  }
  handleStop = async () => {
    this.runnerAPI.run(model.getBlankData(), true);
  }
  handleSave = async () => {
    this.setState({dialog: this.renderSave});
  }
  handleSettings = () => {
    this.setState({dialog: this.renderSettings});
  }
  handleHelp = () => {
    this.setState({dialog: this.renderHelp});
  }
  handleLoad = () => {
    this.setState({dialog: this.renderLoad});
  }
  handleOnLoad = async() => {
    this.setState({dialog: noJSX});
    this.handleRun();
  }
  handleOnSave = (gistId) => {
    window.history.pushState({}, '', `${window.location.origin}?src=${gistId}`);
    this.setState({
      gistId,
      gistOwnerId: this.userManager.getUserData().id,
    });
  }
  handleAbort = () => {
    this.abort();
  };
  renderHelp = () => {
    return (<Help onClose={this.closeDialog} />);
  }
  renderSettings = () => {
    return (
      <Settings onClose={this.closeDialog} />
    );
  }
  renderLoad = () => {
    return (
      <Load
        onLoad={this.handleOnLoad}
        onClose={this.closeDialog}
      />
    );
  }
  renderSave = () => {
    const data = model.getData();
    return (
      <Save
        onSave={this.handleOnSave}
        onClose={this.closeDialog}
        gistId={this.state.gistId}
        gistOwnerId={this.state.gistOwnerId}
        data={data} />
    );
  }
  render() {
    const data = model.getData();
    const {
      loading,
      dialog,
      updateVersion: hackKey,
      userData,
      gistId,
    } = this.state;
    return (
      <div className="App">
        <ServiceContext.Provider value={{
          github: this.github,
          addError: this.addError,
          addInfo: this.addInfo,
          storageManager,
          logManager: this.logManager,
          userManager: this.userManager,
        }}>
        <div className="content">
          <Head />
          <div className="top">
            <div className="left">
              <div className="name">
                <EditLine value={data.name} onChange={v => model.setName(v)} />
                {!!userData.name && <div className="username"><a target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.name}`}>{userData.name}</a></div>}
                {!!userData.avatarURL && <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.name}`}><img className="avatar" src={userData.avatarURL} alt="avatar"/></a>}
              </div>
            </div>
            <div className="right">
              <button tabIndex="1" onClick={this.handleRun}>Run</button>
              <button tabIndex="1" onClick={this.handleStop}>Stop</button>
              <button tabIndex="1" onClick={this.handleSave}>Save</button>
              <button tabIndex="1" onClick={this.handleNew}>New</button>
              <button tabIndex="1" onClick={this.handleLoad}>Load</button>
              <button tabIndex="1" onClick={this.handleSettings} title="settings"><img src={`${window.location.origin}/resources/images/gear.svg`} alt="settings"></img></button>
              <button tabIndex="1" onClick={this.handleHelp} title="help">?</button>
            </div>
          </div>
          {
            !loading &&
              <div className="bottom">
                <IDE
                  hackKey={hackKey}
                  data={data}
                  registerRunnerAPI={this.registerRunnerAPI}
                />
              </div>
          }
        </div>
        <Footer
          gistId={gistId}
          title={data.name}
        />
        {dialog()}
        <div className="messages">
          {
            this.state.messages.map(({msg, className}, i) => (<div className={className} key={`err${i}`}>{msg}</div>))
          }
        </div>
        </ServiceContext.Provider>
      </div>
    );
  }
}

export default App;
