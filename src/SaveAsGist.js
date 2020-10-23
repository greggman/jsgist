import React from 'react';
import {classNames} from './css-utils.js';
import * as gists from './gists.js';
import ServiceContext from './ServiceContext.js';

export default class SaveAsGist extends React.Component {
  constructor () {
    super();
    this.state = {
      saving: false,
    };
  }
  componentDidMount() {
    const {oauthManager} = this.context;
    oauthManager.subscribe(this.onPatChange);
  }
  componentWillUnmount() {
    const {oauthManager} = this.context;
    oauthManager.unsubscribe(this.onPatChange);
  }
  onPatChange = () => {
    this.forceUpdate();
  }
  saveNew = async() => {
    const {oauthManager, github, addError} = this.context;
    this.setState({saving: true});
    const {data, onSave, onClose} = this.props;
    let success = false;
    github.setPat(oauthManager.pat());
    try {
      const {id, name, date} = await github.createGist(data);
      gists.addGist(id, name, date);
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
   const {oauthManager, github, addError} = this.context;
   this.setState({saving: true});
    const {data, gistId, onClose} = this.props;
    let success = false;
    github.setPat(oauthManager.pat());
    try {
      const {id, name, date} = await github.updateGist(gistId, data);
      gists.addGist(id, name, date);
      success = true;
    } catch (e) {
      addError(`could not update gist: ${e}`)
    }
    this.setState({saving: false});
    if (success) {
      onClose();
    }
  }
  renderLogin() {
    const {oauthManager} = this.context;
    return (
      <div>
        <button
          onClick={oauthManager.login}
        >Login with github</button>
      </div>
    );
  }
  renderSave() {
    const {saving} = this.state;
    const {oauthManager} = this.context;
    const pat = oauthManager.pat();
    const {gistId} = this.props;
    const canUpdate = pat && gistId;
    return (
      <div>
        <button
          className={classNames({disabled: saving})}
          data-type="new"
          onClick={this.saveNewGist}
        >Save to New Gist</button>
        <button
          className={classNames({disabled: !canUpdate || saving})}
          data-type="update"
          onClick={this.saveOverExisting}
        >Update Current Gist</button>
      </div>
    );
  }
  render() {
    const {oauthManager} = this.context;
    const pat = oauthManager.pat();
    return pat ? this.renderSave() : this.renderLogin();
  }
}

SaveAsGist.contextType = ServiceContext;