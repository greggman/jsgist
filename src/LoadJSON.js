import React, {useContext, useState} from 'react';
import Code from './Code.js';
import * as model from './model.js';
import ServiceContext from './ServiceContext.js';

export default function LoadJSON(props) {
  const [json, setJSON] = useState('');
  const {addError} = useContext(ServiceContext);
  function load() {
    const {onLoad} = props;
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