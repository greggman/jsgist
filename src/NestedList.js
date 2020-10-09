import React, {useState} from 'react';
import * as model from './model';
import {classNames} from './css-utils.js';

function SetFeature(props) {
  function setFeature() {
    model.set('path', props.path);
  }
  const {name} = props;
  const selected = window.location.pathname === props.path;
  return (<li className={classNames({selected})} onClick={setFeature}>{name}</li>);
}

function CollapsableUL({name, path, children}) {
  const expanded = window.location.pathname.startsWith(`${path}/`);
  const selected = expanded;
  const [collapsed, setCollapsed] =  useState(!expanded);
  return (
    <React.Fragment>
      <li className={classNames({selected})} onClick={() => setCollapsed(!collapsed)}>{name}</li>
      <ul className={classNames({collapsed})}>
        {children}
      </ul>
    </React.Fragment>
  );
}

function FeatureList({path, title, list}) {
  return (
    <CollapsableUL name={title} path={path}>
      { list.map((name, ndx) => (<SetFeature path={`${path}/${name}`} key={`fl${ndx}`} name={name} />)) }
    </CollapsableUL>
  );
}

function APIExpandingList({api}) {
  return (
    <ul>
      <CollapsableUL name={api.name} path={`/${api.name}`}>
        <FeatureList path={`/${api.name}/features`} list={api.features} title='Features' />
        <FeatureList path={`/${api.name}/extensions`} list={api.extensions} title='Extensions' />
      </CollapsableUL>
    </ul>
  );
}

export default class NestedList extends React.Component {
  render() {
    const {data} = this.props;
    return (
      <ul>
        { data.map((api, ndx) => <APIExpandingList key={`nl${ndx}`} api={api} />) }
      </ul>
    );
  }
}