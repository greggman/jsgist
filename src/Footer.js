
import React from 'react';
import GistComment from './GistComment.js';
import GistComments from './GistComments.js';

export default class Footer extends React.Component {
  registerAPI = (api) => {
    this.api = api;
  }
  addComment = (data) => {
    this.api.addComment(data);
  }
  render() {
    const {gistId, title} = this.props;
    return (
      <div className="comments">
        <hr/>
        {
          gistId &&
            <React.Fragment>
              <GistComments gistId={gistId} title={title} registerAPI={this.registerAPI} />
              <GistComment gistId={gistId} addComment={this.addComment} />
            </React.Fragment>
        }
      </div>
    );
  }
}