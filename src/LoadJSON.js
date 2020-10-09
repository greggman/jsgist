import React, {useState} from 'react';
import Code from './Code.js';
import * as model from './model.js';

export default function LoadJSON(props) {
  const [json, setJSON] = useState('');
  function load() {
    const {onLoad, addError} = props;
    try {
      const data = JSON.parse(json);
      model.setData(data);
      onLoad();
    } catch (e) {
      addError(`bad json: ${e}`);
    }
  }
  return (
    <div>
      <div style={{height: '100px'}}>
        <Code
          value={json}
          onValueChange={setJSON}

        />
      </div>
      <p>
        <button onClick={load}>Load JSON</button>
      </p>
    </div>
  )
}