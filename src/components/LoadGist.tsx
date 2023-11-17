import React from 'react';
import MiniSearch from 'minisearch'
import EditLine from './EditLine.js';
import {classNames} from '../libs/css-utils.js';
import * as gists from '../libs/gists.js';
import ServiceContext from '../ServiceContext.js';

type Gist = {
  name: string,
  date: string,
  public: boolean,
  locallySaved?: boolean,
  id: string,
}

// ( ) Wrap table with div, scroll div. Because table expands to 100%

interface GistIdMap {
   [key: string]: Gist;
}

interface ScoredGist extends Gist {
  score: number,
  id: string,
};

type LoadGistState = {
  loading: boolean,
  gists: GistIdMap,
  checks: Set<string>,
  filter: string,  // TODO: move up
  newFilter: boolean,
  sortKey: string, // TODO: move up
  sortDir: string, // TODO: move up
  shift: boolean,
  index: any,
};

function getSortFn(sortKey: string, checks: Set<string>): (a: ScoredGist, b: ScoredGist) => number {
  switch (sortKey) {
    case 'score':
      return (a: ScoredGist, b: ScoredGist) => Math.sign(a.score - b.score);
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

function scoredGistsToSortedArray(gists: ScoredGist[], checks: Set<string>, sortKey: string, sortDir: string) {
  const compareDirMult = sortDir === 'down' ? 1 : -1;
  const compFn = getSortFn(sortKey, checks);
  return gists.slice().sort((b, a) => compFn(a, b) * compareDirMult);
}

function createIndex(gists: GistIdMap) {
  const miniSearch = new MiniSearch({
    fields: ['name'], // fields to index for full-text search
  });
  miniSearch.addAll(Object.entries(gists).map(([id, {name}]) => ({id, name})));
  return miniSearch;
}

function matchingGists(index: MiniSearch, filter: string, gists: GistIdMap): ScoredGist[] {
  filter = filter.trim();
  if (filter === '') {
    return Object.entries(gists)
        .map(([id, gist]) => ({...gist, id, score: 0}))
  }
  const results = new Map(index.search(filter, { prefix: true, fuzzy: 0.2 }).map(r => [r.id, r.score]));
  return Object.entries(gists)
      .filter(([id]) => results.has(id))
      .map(([id, gist]) => ({...gist, id, score: results.get(id)! }))

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

function getDateOfNewestNonLocallySavedGist(gistsById: GistIdMap) {
  let since;
  for (const {date, locallySaved} of Object.values(gistsById)) {
    if (!locallySaved) {
      if (!since || date > since) {
        since = date;
      }
    }
  }
  return since;
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
      newFilter: false,
      sortKey: 'date',
      sortDir: 'down',
      shift: false,
      index: createIndex(_gists),
    };
  }
  handleNewGists = (gists: GistIdMap) => {
    this.setState({
      gists,
      index: createIndex(gists),
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
    this.setState({sortDir, sortKey, newFilter: false});
  }
  componentDidMount() {
    const {userManager} = this.context;
    gists.subscribe(this.handleNewGists);
    userManager.subscribe(this.onUserStatusChange);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }
  componentWillUnmount() {
    const {userManager} = this.context;
    gists.unsubscribe(this.handleNewGists);
    userManager.unsubscribe(this.onUserStatusChange);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
  handleKeyDown = (e: KeyboardEvent) => {
    this.setState({shift: e.shiftKey});
  }
  handleKeyUp = (e: KeyboardEvent) => {
    this.setState({shift: e.shiftKey});
  }
  loadGists = async() => {
    const {addError, github} = this.context;
    this.setState({loading: true});
    try {
      // This doesn't belong here. It's not the UI's responsibility
      // to manage this stuff.
      // Find data of the newest gist that was not locally saved.
      // then pass that to getUserGists so Github will return only
      // newer gists.
      const existingGists = this.state.shift ? {} : this.state.gists;
      const since = getDateOfNewestNonLocallySavedGist(existingGists);
      const gistArray = await github.getUserGists(since);
      const gistsById = gistArray.reduce((gists: any[], gist: any) => {
        gists[gist.id] = {
          name: gist.description,
          date: gist.updated_at,
          public: gist.public,
        };
        return gists;
      }, {...existingGists});
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
    const {gists, checks, loading, index, filter, sortKey, sortDir, shift, newFilter} = this.state;
    const userData = userManager.getUserData();
    const canLoad = !!userData && !loading;
    const effectiveSortKey = newFilter ? 'score' : sortKey;
    const effectiveSortDir = newFilter ? 'down' : sortDir;
    const gistArray = scoredGistsToSortedArray(
        matchingGists(index, filter, gists),
        checks,
        effectiveSortKey, 
        effectiveSortDir);
        
    return (
      <div>
        <p>
          <button
            className={classNames({disabled: !canLoad})}
            onClick={this.loadGists}
          >{shift ? '(Force) ' : ''}Load New Gists</button>
        </p>
         {
            gistArray.length >= 0 &&
              <React.Fragment>
              <p>
                <EditLine className="foobar" placeholder="search:" value={filter} onChange={
                    (filter:string) => {
                      this.setState({filter, newFilter: filter.trim() !== ''});
                    }
                  }
                />
              </p>
              <div className="gists">
                <table>
                  <thead>
                    <tr>
                      <th><SortBy selected={effectiveSortKey === 'check'} sortDir={sortDir} update={(dir: string) => this.updateSort('check', dir)}/></th>
                      <th><SortBy selected={effectiveSortKey === 'name'} sortDir={sortDir} update={(dir: string) => this.updateSort('name', dir)}/></th>
                      <th><SortBy selected={effectiveSortKey === 'date'} sortDir={sortDir} update={(dir: string) => this.updateSort('date', dir)}/></th>
                      <th><SortBy selected={effectiveSortKey === 'public'} sortDir={sortDir} update={(dir: string) => this.updateSort('public', dir)}/></th>
                    </tr>
                  </thead>
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
