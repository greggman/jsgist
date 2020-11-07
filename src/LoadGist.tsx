import React from 'react';
import {classNames} from './css-utils.js';
import * as gists from './gists.js';
import ServiceContext from './ServiceContext.js';

type LoadGistState = {
  loading: boolean,
  gists: any[],
};

export default class LoadGist extends React.Component<{}, LoadGistState> {
  constructor (props: {}) {
    super(props);
    this.state = {
      loading: false,
      gists: gists.getGists(),
    };
  }
  handleNewGists = (gists: any[]) => {
    this.setState({gists});
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
        };
        return gists;
      }, {});
      gists.setGists(gistsById);
    } catch (e) {
      addError(`could not load gists: ${e}`);
    }
    this.setState({loading: false});
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
    const {gists, loading} = this.state;
    const userData = userManager.getUserData();
    const canLoad = !!userData && !loading;
    const gistArray = Object.entries(gists).map(([id, {name, date}]) => {
      return {id, name, date};
    }).sort((b, a) => a.date < b.date ? -1 : ((a.date > b.date) ? 1 : 0));
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
              </table>
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
