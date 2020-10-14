import React from 'react';
import {classNames} from './css-utils.js';
import {updateURL} from './url.js';
import {noop, wait} from './utils.js';

export default class LoadGist extends React.Component {
  constructor () {
    super();
    this.state = {
      loading: false,
      pat: localStorage.getItem('pat') || '',
      gists: [],
    };
  }
  handlePATChange = (e) => {
    const pat = e.target.value;
    this.setState({pat});
    localStorage.setItem('pat', pat);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.loadGists();
  }
  componentDidMount() {
    document.body.addEventListener('submit', this.handleSubmit);
  }
  componentWillUnmount() {
    document.body.removeEventListener('submit', this.handleSubmit);
  }
  loadGists = async(e) => {
    this.setState({loading: true});
    const {addError, github} = this.props;
    const {pat} = this.state;
    github.setPat(pat);
    try {
      const gists = await github.getUserGists();
      this.setState({
        gists: gists.map(g => g),
      });
      // apparently we need to update the URL in order for the browser
      // to save the password.
      updateURL({loggedIn: true});
      await wait();
      updateURL({loggedIn: undefined});
    } catch (e) {
      addError(`could not load gists: ${e}`);
    }
    this.setState({loading: false});
  }
  render() {
    const {pat, gists, loading} = this.state;
    const canLoad = !!pat && !loading;
    return (
      <div>
        <form>
          <div className="save-as-gist-pat">
            <div>Personal Access Token:&nbsp;</div>
            <div>
              <input type="text" name="username" value="unused" style={{display: 'none'}} onChange={noop} />
              <input
                type="password"
                name="password"
                value={pat}
                placeholder="personal access token"
                onChange={this.handlePATChange}
              />
            </div>
          </div>
          <p>
            <button
              type="submit"
              className={classNames({disabled: !canLoad})}
            >Load Your Gists</button>
          </p>
        </form>
        <p>
          <a target="_blank" rel="noopener noreferrer" href="https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token">Create a Personal Access Token</a> with only <b>gist</b> permissions.
          Paste it above. Note: This is a static website. Your person access token
          is stored only locally in your browser and only accessible by this domain.
        </p>
        {
          gists.length ?
            <table className="gists">
              <tbody>
              {
                gists.map((gist, ndx) => {
                  return (
                    <tr key={`g${ndx}`}>
                      <td><a href={`${window.location.origin}?src=${encodeURIComponent(gist.id)}`}>{gist.description}</a></td>
                      <td>{gist.updated_at.substring(0, 10)}</td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table> : []
        }
      </div>
    );
  }
}