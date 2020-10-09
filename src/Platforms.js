import React from 'react';
import Results from './Results';
import {parse} from 'platform';

export default function Platforms(props) {
  const {tests} = props;

  // TODO: as this is costly we should decide how to optimize
  // 1. change the format?
  // 2. use shouldComponent
  const platforms = [...tests.reduce((platforms, test) => {
    return Object.keys(test.platforms).reduce((platforms, plat) => {
      platforms.add(plat);
      return platforms;
    }, platforms);
  }, new Set())];
  
  return (
    <div>
      <div>Platforms:</div>
      <div>
        {
          platforms.map((platform, ndx) => {
            return (
              <div key={`plat${ndx}`}>
                <div>{parse(platform).description}</div>
                <Results tests={tests.filter(test => test.platforms[platform])} />
              </div>
            );
          })
        }
      </div>
    </div>
  )
}