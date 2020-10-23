import React from 'react';
import {classNames} from './css-utils.js';
import * as gists from './gists.js';
import ServiceContext from './ServiceContext.js';

export default class LoadGist extends React.Component {
  constructor () {
    super();
    this.state = {
      loading: false,
      gists: gists.getGists(),
    };
  }
  handleNewGists = (gists) => {
    this.setState({gists});
  }
  onPatChange = () => {
    this.forceUpdate();
    const {oauthManager} = this.context;
    const pat = oauthManager.pat();
    if (pat) {
      this.loadGists();
    }
  }
  componentDidMount() {
    const {oauthManager} = this.context;
    gists.subscribe(this.handleNewGists);
    oauthManager.subscribe(this.onPatChange);
  }
  componentWillUnmount() {
    const {oauthManager} = this.context;
    gists.unsubscribe(this.handleNewGists);
    oauthManager.unsubscribe(this.onPatChange);
  }
  loadGists = async(e) => {
    const {addError, github, oauthManager} = this.context;
    this.setState({loading: true});
    github.setPat(oauthManager.pat());
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
    } catch (e) {
      addError(`could not load gists: ${e}`);
    }
    this.setState({loading: false});
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
  renderLoad() {
    const {oauthManager} = this.context;
    const {gists, loading} = this.state;
    const pat = oauthManager.pat();
    const canLoad = !!pat && !loading;
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
  render() {
    const {oauthManager} = this.context;
    const pat = oauthManager.pat();
    return pat ? this.renderLoad() : this.renderLogin();
  }
}

LoadGist.contextType = ServiceContext;
