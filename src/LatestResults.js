import React from 'react';
import Results from './Results';

export default function LatestResults(props) {
  const {tests} = props;

  return (
    <div>
      <div>Latest Results:</div>
      <Results tests={tests} />
    </div>
  );
}