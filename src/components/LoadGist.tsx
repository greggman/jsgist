import React from 'react';
import EditLine from './EditLine.js';
import {classNames} from '../libs/css-utils.js';
import * as gists from '../libs/gists.js';
import ServiceContext from '../ServiceContext.js';

type Gist = {
  name: string,
  date: string,
  public: boolean,
  id: string,
}

// ( ) Wrap table with div, scroll div. Because table expands to 100%

interface GistIdMap {
   [key: string]: Gist;
} 

type LoadGistState = {
  loading: boolean,
  gists: GistIdMap,
  checks: Set<string>,
  filter: string,  // TODO: move up
  sortKey: string, // TODO: move up
  sortDir: string, // TODO: move up
};

function getSortFn(sortKey: string, checks: Set<string>): (a: Gist, b: Gist) => number {
  switch (sortKey) {
    case 'name':
      return (a: Gist, b: Gist) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
    case 'date':
      return (a: Gist, b: Gist) => a.date < b.date ? -1 : (a.date > b.date ? 1 : 0);
    case 'public':
      return (a: Gist, b: Gist) => {
        const ap = a.public ? 1 : 0;
        const bp = b.public ? 1 : 0;
        return Math.sign(ap - bp);
      };
    case 'check':
      return (a: Gist, b: Gist) => {
        const ap = checks.has(a.id) ? 1 : 0;
        const bp = checks.has(b.id) ? 1 : 0;
        return Math.sign(ap - bp);
      };
    default:
      throw new Error('unknown sortKey');
  }
}

function gistsToSortedArray(gists: GistIdMap, checks: Set<string>, sortKey: string, sortDir: string) {
  const compareDirMult = sortDir === 'down' ? 1 : -1;
  const compFn = getSortFn(sortKey, checks);
  console.log('sortDir:', compareDirMult);
  return Object.entries(gists).map(([id, {name, date, public: _public}]) => {
    return {id, name, date, public: _public};
  }).sort((b, a) => compFn(a, b) * compareDirMult);
}

function matchFilter(filter: string) {
  filter = filter.trim().toLowerCase();
  return function(gist: Gist) {
    const {name, date} = gist;
    return filter === '' ||
           name.toLowerCase().includes(filter) ||
           date.substring(0, 10).includes(filter);
  }
}


type SortKeyInfo = {
  sortDir: string,
  selected: boolean,
  update: (sortDir: string) => void,
};

function SortBy(props: SortKeyInfo) {
  const {sortDir, selected, update} = props;
  return (
    <React.Fragment>
      <span onClick={() => update(!selected ? sortDir : (sortDir === 'up' ? 'down' : 'up'))} className={selected ? 'current-sort-key' : ''}>{sortDir === 'up' ? '▲' : '▼'}</span>
    </React.Fragment>
  );
}

export default class LoadGist extends React.Component<{}, LoadGistState> {
  constructor (props: {}) {
    super(props);
    const _gists = gists.getGists();
    this.state = {
      loading: false,
      gists: _gists,
      checks: new Set(),
      filter: '',
      sortKey: 'date',
      sortDir: 'down',
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
  updateSort = (sortKey: string, sortDir: string) => {
    console.log('update:', sortKey, sortDir);
    this.setState({sortDir, sortKey});
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
    const {gists, checks, loading, filter, sortKey, sortDir} = this.state;
    const userData = userManager.getUserData();
    const canLoad = !!userData && !loading;
    const gistArray = gistsToSortedArray(gists, checks, sortKey, sortDir);
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
              <p>
                <EditLine className="foobar" placeholder="search:" value={filter} onChange={(filter:string) => {this.setState({filter})}} />
              </p>
              <div className="gists">
                <table>
                  <thead>
                    <tr>
                      <th><SortBy selected={sortKey === 'check'} sortDir={sortDir} update={(dir: string) => this.updateSort('check', dir)}/></th>
                      <th><SortBy selected={sortKey === 'name'} sortDir={sortDir} update={(dir: string) => this.updateSort('name', dir)}/></th>
                      <th><SortBy selected={sortKey === 'date'} sortDir={sortDir} update={(dir: string) => this.updateSort('date', dir)}/></th>
                      <th><SortBy selected={sortKey === 'public'} sortDir={sortDir} update={(dir: string) => this.updateSort('public', dir)}/></th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    gistArray.filter(matchFilter(filter)).map((gist, ndx) => {
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
              </div>
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
