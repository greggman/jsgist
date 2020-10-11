import React from 'react';
import { classNames } from './css-utils.js';

export default class SaveAsGist extends React.Component {
  constructor () {
    super();
    this.state = {
      saving: false,
      pat: localStorage.getItem('pat') || '',
    };
  }
  handlePATChange = (e) => {
    const pat = e.target.value;
    this.setState({pat});
    localStorage.setItem('pat', pat);
  }
  onSaveNew = async() => {
    this.setState({saving: true});
    const {data, github, addError, onSave} = this.props;
    const {pat} = this.state;
    github.setPat(pat);
    try {
      const gistId = await github.createGist(data);
      onSave(gistId);
    } catch (e) {
      addError(`could not create gist: ${e}`)
    }
    this.setState({saving: false});
  }
  onSaveOverExisting = async() => {
    this.setState({saving: true});
    const {data, gistId, github, addError} = this.props;
    const {pat} = this.state;
    github.setPat(pat);
    try {
      await github.updateGist(gistId, data);
    } catch (e) {
      addError(`could not update gist: ${e}`)
    }
    this.setState({saving: false});
  }
  render() {
    const {pat} = this.state;
    const {gistId} = this.props;
    const canSave = pat && gistId;
    return (
      <div>
        <div className="save-as-gist-pat">
          <div>Personal Access Token:&nbsp;</div>
          <div>
            <input
              type="password"
              value={pat}
              placeholder="personal access token"
              onChange={this.handlePATChange}
            />
          </div>
        </div>
        <p>
          <button
            className={classNames({disabled: !pat})}
            onClick={this.onSaveNew}
          >Save to new Gist</button>
          <button
            className={classNames({disabled: !canSave})}
            onClick={this.onSaveOverExisting}
          >Update Existing Gist</button>
        </p>
        <p>
          <a href="https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token">Create a Personal Access Token</a> with only <b>gist</b> permissions.
          Paste it above. Note: This is a static website. Your person access token
          is stored only locally in your browser and only accessible by this domain.
        </p>
      </div>
    );
  }
}