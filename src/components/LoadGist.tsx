import React from 'react';
import {classNames} from '../libs/css-utils.js';
import * as gists from '../libs/gists.js';
import ServiceContext from '../ServiceContext.js';

type Gist = {
  name: string,
  date: string,
  public: boolean,
}

interface GistIdMap {
   [key: string]: Gist;
} 

type LoadGistState = {
  loading: boolean,
  gists: GistIdMap,
  checks: Set<string>,
};

function gistsToSortedArray(gists: GistIdMap) {
  return Object.entries(gists).map(([id, {name, date, public: _public}]) => {
    return {id, name, date, public: _public};
  }).sort((b, a) => a.date < b.date ? -1 : ((a.date > b.date) ? 1 : 0));
}

export default class LoadGist extends React.Component<{}, LoadGistState> {
  constructor (props: {}) {
    super(props);
    const _gists = gists.getGists();
    this.state = {
      loading: false,
      gists: _gists,
      checks: new Set(),
    };
  }
  handleNewGists = (gists: GistIdMap) => {
    this.setState({
      gists,
    });
  }
  toggleCheck = (id: string) => {
    const checks = new Set(this.state.checks);
    if (checks.has(id)) {
      checks.delete(id);
    } else {
      checks.add(id);
    }
    this.setState({checks});
  }
  onUserStatusChange = () => {
    this.forceUpdate();
    const {userManager} = this.context;
    if (userManager.getUserData()) {
      this.loadGists();
    }
  }
  componentDidMount() {
    const {userManager} = this.context;
    gists.subscribe(this.handleNewGists);
    userManager.subscribe(this.onUserStatusChange);
  }
  componentWillUnmount() {
    const {userManager} = this.context;
    gists.unsubscribe(this.handleNewGists);
    userManager.unsubscribe(this.onUserStatusChange);
  }
  loadGists = async() => {
    const {addError, github} = this.context;
    this.setState({loading: true});
    try {
      const gistArray = await github.getUserGists();
      const gistsById = gistArray.reduce((gists: any[], gist: any) => {
        gists[gist.id] = {
          name: gist.description,
          date: gist.updated_at,
          public: gist.public,
        };
        return gists;
      }, {});
      gists.setGists(gistsById);
    } catch (e) {
      addError(`could not load gists: ${e}`);
    }
    this.setState({loading: false});
  }
  deleteSelected = async() => {
    const {checks, gists: _gists} = this.state;
    const ids: string[] = [];
    // just incase?
    checks.forEach((id, ndx) => {
      if (_gists[id]) {
        ids.push(id);
      }
    });
    const {addError, github} = this.context;
    this.setState({loading: true});
    for (const id of ids) {
      try {
        await github.deleteGist(id);
        gists.removeGist(id);
      } catch(e) {
        addError(`could not delete gist: ${id}: ${e}`);
      }
    }
    this.setState({loading: false});
  }
  clearBackup = () => {
    const {backupManager} = this.context;
    backupManager.clearBackup();
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
  renderLoad() {
    const {userManager} = this.context;
    const {gists, checks, loading} = this.state;
    const userData = userManager.getUserData();
    const canLoad = !!userData && !loading;
    const gistArray = gistsToSortedArray(gists);
    return (
      <div>
        <p>
          <button
            className={classNames({disabled: !canLoad})}
            onClick={this.loadGists}
          >{gistArray.length ? 'Reload' : 'Load'} Your Gists</button>
        </p>
         {
            gistArray.length >= 0 &&
              <React.Fragment>
              <table className="gists">
                <tbody>
                {
                  gistArray.map((gist, ndx) => {
                    return (
                      <tr key={`g${ndx}`}>
                        <td><input type="checkbox" id={`gc${ndx}`} checked={checks.has(gist.id)} onChange={() => this.toggleCheck(gist.id)}/><label htmlFor={`gc${ndx}`}/></td>
                        <td><a onClick={this.clearBackup} href={`${window.location.origin}?src=${encodeURIComponent(gist.id)}`}>{gist.name}</a></td>
                        <td>{gist.date.substring(0, 10)}</td>
                        <td>{gist.public ? '' : '🔒'}</td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
              <div><button onClick={this.deleteSelected}>Delete Selected Gists</button></div>
              </React.Fragment>
          }
      </div>
    );
  }
  render() {
    const {userManager} = this.context;
    const userData = userManager.getUserData();
    return userData ? this.renderLoad() : this.renderLogin();
  }
}

LoadGist.contextType = ServiceContext;
