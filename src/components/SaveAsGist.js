import React from 'react';
import {classNames} from '../libs/css-utils.js';
import * as gists from '../libs/gists.js';
import ServiceContext from '../ServiceContext.js';

export default class SaveAsGist extends React.Component {
  constructor () {
    super();
    this.state = {
      saving: false,
      secret: false,
    };
  }
  componentDidMount() {
    const {userManager} = this.context;
    userManager.subscribe(this.onPatChange);
  }
  componentWillUnmount() {
    const {userManager} = this.context;
    userManager.unsubscribe(this.onPatChange);
  }
  onPatChange = () => {
    this.forceUpdate();
  }
  toggleSecret = () => {
    this.setState({secret: !this.state.secret});
  }
  saveNew = async() => {
    const {github, addError} = this.context;
    const {secret} = this.state;
    this.setState({saving: true});
    const {data, onSave, onClose} = this.props;
    let success = false;
    try {
      const {id, name, date, public: _public} = await github.createGist(data, secret);
      gists.addGist(id, name, date, _public);
      onSave(id);
      success = true;
    } catch (e) {
      addError(`could not create gist: ${e}`)
    }
    this.setState({saving: false});
    if (success) {
      onClose();
    }
  }
  saveOverExisting = async() => {
    const {github, addError} = this.context;
    this.setState({saving: true});
    const {data, gistId, onClose} = this.props;
    let success = false;
    try {
      const {id, name, date, public: _public} = await github.updateGist(gistId, data);
      gists.addGist(id, name, date, _public);
      success = true;
    } catch (e) {
      addError(`could not update gist: ${e}`)
    }
    this.setState({saving: false});
    if (success) {
      onClose();
    }
  }
  forkAndSave = async() => {
    const {github, addError} = this.context;
    const {data, gistId, onSave, onClose} = this.props;
    const {secret} = this.state;
    this.setState({saving: true});
    let success = false;
    try {
      const {id: newId} = await github.forkGist(gistId, secret);
      const {id, name, date, public: _public} = await github.updateGist(newId, data);
      gists.addGist(id, name, date, _public);
      onSave(id);
      success = true
    } catch (e) {
      addError(`could not fork and update gist: ${e}`);
    }
    this.setState({saving: false});
    if (success) {
      onClose();
    }
  }
  renderLogin() {
    const {userManager} = this.context;
    return (
      <div>
        <button
          onClick={userManager.login}
        >Login with github</button>
      </div>
    );
  }
  renderSave() {
    const {saving, secret} = this.state;
    const {userManager} = this.context;
    const userData = userManager.getUserData();
    const {gistId, gistOwnerId} = this.props;
    const canUpdate = userData && gistId && userData.id === gistOwnerId;
    const canFork = userData && gistId && userData.id !== gistOwnerId;
    return (
      <div>
        <div>
          <button
            className={classNames({disabled: saving})}
            data-type="new"
            onClick={this.saveNew}
          >Save to New Gist</button>
          <button
            className={classNames({disabled: !canUpdate || saving})}
            data-type="update"
            onClick={this.saveOverExisting}
          >Update Current Gist</button>
          <button
            className={classNames({disabled: !canFork || saving})}
            data-type="fork"
            onClick={this.forkAndSave}
          >Fork and Save Gist</button>
        </div>
        <div>
          <br/>
          <input
            type="checkbox"
            checked={secret}
            id="save-secret"
            onChange={this.toggleSecret}
          />
          <label htmlFor="save-secret">Secret (unlisted)</label>
          <blockquote>Warning:
            <ul>
              <li>You can not change a gist from public to secret</li>
              <li>Secret gists are still publicly accessible they're just unlisted</li>
            </ul>
            (<a href="https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/creating-gists" target="_blank" rel="noopener noreferrer">see docs</a>)
          </blockquote>
        </div>
      </div>
    );
  }
  render() {
    const {userManager} = this.context;
    const userData = userManager.getUserData();
    return userData ? this.renderSave() : this.renderLogin();
  }
}

SaveAsGist.contextType = ServiceContext;