import * as model from './model.js';

export default class TestRunner {
  run(data) {
    return new Promise(resolve => {
      const base = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : window.location.origin;
      const html = `
      <${'script'} type="module" src="${base}/error-reporter.js"></${'script'}>
      <${'script'} src="${base}/3rdparty/lodash.js"></${'script'}>
      <${'script'} src="${base}/3rdparty/platform.js"></${'script'}>
      <${'script'} src="${base}/3rdparty/benchmark.js"></${'script'}>
      <${'script'}>
      const model = ${JSON.stringify(data)};
      </${'script'}>
      <${'script'}>
      ${data.initialization}
      </${'script'}>
      <body>
      </body>
      <${'script'} type="module" src="${base}/runner.js"></${'script'}>
      `;
      const iframe = document.createElement('iframe');
      model.clearAllTestResults();

      const handlers = {
        // window.addEventListener('error')
        uncaughtError(data) {
        },
        // benchmark onAbort
        abort(data) {
        },
        // benchmark onError
        error(data) {
        },
        // benchmark onCycle
        cycle(data) {
          const ndx = parseInt(data.name);
          const newData = {...data};
          delete newData.id;
          delete newData.name;
          model.setTestResult(ndx, newData, window.navigator.userAgent);
        },
        // benchmark onComplete
        complete(data) {
          window.removeEventListener('message', handleMessage);
          iframe.remove();
          resolve(data);
        },
      }

      const handleMessage = (e) => {
        const {type, data} =  e.data;
        handlers[type](data);
      };
      window.addEventListener('message', handleMessage);
      const blob = new Blob([html], {type: 'text/html'});
      iframe.sandbox = 'allow-scripts';
      iframe.src = URL.createObjectURL(blob);
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    });
  }
};