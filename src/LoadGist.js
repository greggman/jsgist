import React from 'react';
import {classNames} from './css-utils.js';
import * as gists from './gists.js';
import {storageManager} from './globals.js';
import {updateURL} from './url.js';
import {noop, wait} from './utils.js';

export default class LoadGist extends React.Component {
  constructor () {
    super();
    this.state = {
      loading: false,
      pat: storageManager.get('pat') || '',
      gists: gists.getGists(),
    };
  }
  handlePATChange = (e) => {
    const pat = e.target.value;
    this.setState({pat});
    storageManager.set('pat', pat);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.loadGists();
  }
  handleNewGists = (gists) => {
    this.setState({gists});
  }
  componentDidMount() {
    document.body.addEventListener('submit', this.handleSubmit);
    gists.subscribe(this.handleNewGists);
  }
  componentWillUnmount() {
    document.body.removeEventListener('submit', this.handleSubmit);
    gists.unsubscribe(this.handleNewGists);
  }
  loadGists = async(e) => {
    this.setState({loading: true});
    const {addError, github} = this.props;
    const {pat} = this.state;
    github.setPat(pat);
    try {
      const gistArray = await github.getUserGists();
      const gistsById = gistArray.reduce((gists, gist) => {
        gists[gist.id] = {
          name: gist.description,
          date: gist.updated_at,
        };
        return gists;
      }, {});
      gists.setGists(gistsById);
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
    const gistArray = Object.entries(gists).map(([id, {name, date}]) => {
      return {id, name, date};
    }).sort((b, a) => a.date < b.date ? -1 : ((a.date > b.date) ? 1 : 0));
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
            >{gistArray.length ? 'Reload' : 'Load'} Your Gists</button>
          </p>
        </form>
        <p>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/settings/tokens">Create a Personal Access Token</a> with only <b>gist</b> permissions.
          Paste it above. Note: This is a static website. Your personal access token
          is stored only locally in your browser and only accessible by this domain.
        </p>
        {
          gistArray.length ?
            <table className="gists">
              <tbody>
              {
                gistArray.map((gist, ndx) => {
                  return (
                    <tr key={`g${ndx}`}>
                      <td><a href={`${window.location.origin}?src=${encodeURIComponent(gist.id)}`}>{gist.name}</a></td>
                      <td>{gist.date.substring(0, 10)}</td>
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