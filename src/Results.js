import React from 'react';
import {formatResults, testResultsAreValid} from './model.js';
import Progress from './Progress.js';

function Result(props) {
  const {max, test} = props;
  const {name, results} = test;
  const msg = formatResults(results);
  return (
    <div className="result">
      <div className="result-name">{name}</div>
      <Progress
        max={max}
        value={results.hz}
        className="result-result"
        text={msg}
      />
    </div>
  )
}



export default function Results(props) {
  const {tests} = props;
  const max = tests
      .filter(testResultsAreValid)
      .reduce((max, test) => Math.max(max, test.results.hz || 0), 0);
  return (
    <div>
      {
        tests.map((test, ndx) => (<Result max={max} test={test} key={`res${ndx}`} />))
      }
    </div>
  );
};