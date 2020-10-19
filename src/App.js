import React from 'react';

import EditLine from './EditLine.js';
import Files from './Files.js';
import Footer from './Footer.js';
import GitHub from './GitHub.js';
import Help from './Help.js';
import Load from './Load.js';
import {loadGistFromSrc} from './loader.js';
import Log, {LogManager} from './Log.js';
import * as model from './model.js';
import Save from './Save.js';
import Settings from './Settings.js';
import Split from './Split.js';
import Runner from './Runner.js';

import './App.css';

const backupKey = 'jsGist-backup';
const noJSX = () => [];
const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');
const makeDisqusId = () => {
  const loc = window.location;
  const query = Object.fromEntries(new URLSearchParams(loc.search).entries());
  const src = query.src;
  return src
      ? `${encodeURIComponent(src)}`
      : '';
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      path: window.location.pathname,
      disqusId: makeDisqusId(),
      dark: darkMatcher.matches,
      loading: false,
      dialog: noJSX,
      gistId: '',
      pat: localStorage.getItem('pat'),
      messages: [],
      userData: {},
      updateVersion: 0,
    };
    this.github = new GitHub();
    this.logManager = new LogManager();
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
        disqusId: makeDisqusId(),
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
    const backup = localStorage.getItem(backupKey);
    let loaded = false;
    if (backup) {
      try {
        const data = JSON.parse(backup);
        if (data.href === window.location.href) {
          model.setData(data.data);
          loaded = true;
          this.addInfo('loaded backup from local storage')
        }
      } catch (e) {
        console.log('bad backup')
      }
      localStorage.removeItem(backupKey);
    }
    if (!loaded && query.src) {
      this.loadData(query.src);
    }
  }
  async loadData(src) {
    this.setState({loading: true});
    let success = true;
    try {
      const {data, id} = await loadGistFromSrc(src, this.github);
      model.setData(data);
      if (id) {
        this.setState({gistId: src})
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
  registerFilesAPI = (api) => {
    this.filesAPI = api;
  }
  handleNew = async() => {
    window.location.href = window.location.origin;
    //window.history.pushState({}, '', `${window.location.origin}`);
    //model.setData(model.getNewData());
  }
  handleRun = async () => {
    localStorage.setItem(backupKey, JSON.stringify({
      href: window.location.href,
      data: model.getData(),
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
    this.setState({gistId});
  }
  handleAbort = () => {
    this.abort();
  };
  handleGoToLine = (data) => {
    this.filesAPI.goToLine(data);
  }
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
        addError={this.addError}
        github={this.github}
      />
    );
  }
  renderSave = () => {
    const data = model.getData();
    return (
      <Save
        onSave={this.handleOnSave}
        onClose={this.closeDialog}
        addError={this.addError}
        github={this.github}
        gistId={this.state.gistId}
        data={data} />
    );
  }
  render() {
    const data = model.getData();
    const {
      loading,
      dialog,
      // disqusId,
      updateVersion: hackKey,
      userData,
    } = this.state;
    const extra = [];
    return (
      <div className="App">
        <div className="content">
          <div className="head">
            <div>
              <img src="/resources/images/logo-small.svg" alt="logo"/>
            jsGist.org<span className="beta">(alpha)</span>
            </div>
            <div className="fix-help-contribute">
              <div className="three-words">
                <div><a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">Fix</a></div>
                <div><a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">Help</a></div>
                <div><a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">Contribute</a></div>
              </div>
              <div className="octocat">
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">
                  <img alt="github" src="/resources/images/octocat-icon.svg"/>
                </a>
              </div>
            </div>
          </div>
          <div className="top">
            <div className="left">
              <div className="name">
                <EditLine value={data.name} onChange={v => model.setName(v)} />
                {userData.name ? <div className="username"><a target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.name}`}>{userData.name}</a></div> : [] }
                {userData.avatarURL ? <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.name}`}><img className="avatar" src={userData.avatarURL} alt="avatar"/></a> : []}
              </div>
            </div>
            <div className="right">
              <button tabIndex="1" onClick={this.handleRun}>Run</button>
              <button tabIndex="1" onClick={this.handleStop}>Stop</button>
              <button tabIndex="1" onClick={this.handleSave}>Save</button>
              <button tabIndex="1" onClick={this.handleNew}>New</button>
              <button tabIndex="1" onClick={this.handleLoad}>Load</button>
              {/*<button tabIndex="1" onClick={this.handleSettings} title="settings"><img src={`${window.location.origin}/resources/images/gear.svg`} alt="settings"></img></button>*/}
              <button tabIndex="1" onClick={this.handleHelp} title="help">?</button>
            </div>
          </div>
          {
            loading ? [] : (
              <div className="bottom">
                <Split direction="horizontal" minSize={0}>
                  <div className="left">
                    <Files data={data} hackKey={hackKey} extra={extra} registerAPI={this.registerFilesAPI} />
                  </div>
                  <div className="right">
                    <Split direction="vertical" sizes={[0.9, 0.1]}>
                      <Runner logManager={this.logManager} registerRunnerAPI={this.registerRunnerAPI} />
                      <Log logManager={this.logManager} onGoToLine={this.handleGoToLine} />
                    </Split>
                  </div>
                </Split>
              </div>
            )
          }
        </div>
        <Footer
          disqusId={makeDisqusId()}
          title={data.name}
        />
        {dialog()}
        <div className="messages">
          {
            this.state.messages.map(({msg, className}, i) => (<div className={className} key={`err${i}`}>{msg}</div>))
          }
        </div>
      </div>
    );
  }
}

export default App;
