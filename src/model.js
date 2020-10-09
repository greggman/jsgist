const isDev = process.env.NODE_ENV === 'development';

const trackedValues = {};

function getValueOrMakeNew(name) {
  const trackedValue = trackedValues[name] || {
    subscriptions: new Set(),
  };
  trackedValues[name] = trackedValue;
  return trackedValue;
}

export function add(name, initialValue) {
  const trackedValue = getValueOrMakeNew(name);
  if (initialValue !== undefined) {
    trackedValue.value = initialValue;
  }
  return trackedValue;
}

export function get(name) {
  return trackedValues[name];
}

export function set(name, newValue) {
  const trackedValue = trackedValues[name];
  if (!trackedValue) {
    throw new Error(`no such track value: ${name}`);
  }
  trackedValue.value = newValue;
  const fns = [...trackedValue.subscriptions.keys()];
  //setTimeout(() => {
    for (const fn of fns) {
      fn(newValue, name);
    }
  //});
}

export function subscribe(name, fn) {
  const trackedValue = getValueOrMakeNew(name);
  trackedValue.subscriptions.add(fn);
}

export function unsubscribe(name, fn) {
  const trackedValue = getValueOrMakeNew(name);
  trackedValue.subscriptions.delete(fn);
}

const newTestData = {
  "title": "My Test",
  "initialization": "// runs once",
  "setup": "// runs before each test",
  "tests": [
    {
      name: "test 1",
      code: "// put test code here",
      results: {},
      platforms: {},
    },
    {
      name: "test 2",
      code: "// put test code here",
      results: {},
      platforms: {},
    },
  ],
};
export function getNewTestData() {
  return JSON.parse(JSON.stringify(newTestData));
}

/* eslint no-template-curly-in-string:0 */
export let data = isDev ? {
  "title": "My test",
  "setup": "",
  "initialization": "const vowelArray = ['a', 'e', 'i', 'o', 'u'];\nconst isVowelByArray = c => vowelArray.includes(c.toLowerCase());\nconst isVowelByOr = c => {\n  c = c.toLowerCase();\n  return c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u';\n}\nconst test = new Array(1000).fill(0).map(_ => String.fromCharCode(0x61 + Math.random() * 26 | 0)).join('');\nconst expected = test.split('').reduce((sum, c) => sum + isVowelByArray(c), 0);\nconst verify = result => {\n  if (result !== expected) {\n    throw new Error(`actual: ${result} not equal to expected: ${expected}`);\n  }\n};\nconsole.log('-setup-');\n",
  "tests": [
    {
      "name": "test1",
      "code": "let sum = 0;\nfor (let i = 0; i < test.length; ++i) {\n  sum += isVowelByArray(test[i]);\n}\nverify(sum);\n",
      "results": {
        "aborted": false,
        "count": 3925,
        "cycles": 6,
        "hz": 48757.763975155285,
        "stats": {
          "numSamples": 45,
          "moe": 1.3253034196794547e-7,
          "rme": 0.6461883133219702,
          "sem": 6.761752141221708e-8,
          "deviation": 5.409401712977366e-7,
          "mean": 0.000020509554140127386,
          "variance": 2.926162689236246e-13
        },
        "times": {
          "cycle": 0.08049999999999999,
          "elapsed": 6.087,
          "period": 0.000020509554140127386,
          "timeStamp": 1602070187852
        }
      },
      "platforms": {
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36": [
          {
            "aborted": false,
            "count": 3925,
            "cycles": 6,
            "hz": 48757.763975155285,
            "stats": {
              "numSamples": 45,
              "moe": 1.3253034196794547e-7,
              "rme": 0.6461883133219702,
              "sem": 6.761752141221708e-8,
              "deviation": 5.409401712977366e-7,
              "mean": 0.000020509554140127386,
              "variance": 2.926162689236246e-13
            },
            "times": {
              "cycle": 0.08049999999999999,
              "elapsed": 6.087,
              "period": 0.000020509554140127386,
              "timeStamp": 1602070187852
            }
          }
        ]
      }
    },
    {
      "name": "test2",
      "code": "let sum = 0;\nfor (let i = 0; i < test.length; ++i) {\n  sum += isVowelByOr(test[i]);\n}\nverify(sum);\n",
      "results": {
        "aborted": false,
        "count": 4467,
        "cycles": 4,
        "hz": 55738.7911907046,
        "stats": {
          "numSamples": 45,
          "moe": 1.6987329815854215e-7,
          "rme": 0.9468532294935285,
          "sem": 8.667005008088886e-8,
          "deviation": 6.879221958946363e-7,
          "mean": 0.00001794082682164028,
          "variance": 4.732369476044983e-13
        },
        "times": {
          "cycle": 0.08014167341226712,
          "elapsed": 5.979,
          "period": 0.00001794082682164028,
          "timeStamp": 1602070193946
        }
      },
      "platforms": {
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36": [
          null,
          {
            "aborted": false,
            "count": 4467,
            "cycles": 4,
            "hz": 55738.7911907046,
            "stats": {
              "numSamples": 45,
              "moe": 1.6987329815854215e-7,
              "rme": 0.9468532294935285,
              "sem": 8.667005008088886e-8,
              "deviation": 6.879221958946363e-7,
              "mean": 0.00001794082682164028,
              "variance": 4.732369476044983e-13
            },
            "times": {
              "cycle": 0.08014167341226712,
              "elapsed": 5.979,
              "period": 0.00001794082682164028,
              "timeStamp": 1602070193946
            }
          }
        ]
      }
    }
  ]
} : getNewTestData();

add('dataVersion', 0);   // any data changes
add('updateVersion', 0);  // all data changes

function notify() {
  set('dataVersion', get('dataVersion') + 1);
}

export function addTest() {
  const name = `test ${data.tests.length + 1}`;
  data.tests.push({
    name,
    code: `// ${name}`,
    results: {},
    platforms: {},
  });
  notify();
}

export function setTitle(title) {
  data.title = title;
  notify();
}

export function setInitialization(init) {
  data.initialization = init;
  notify();
}

export function setSetup(setup) {
  data.setup = setup;
  notify();
}

export function setTestName(ndx, name) {
  data.tests[ndx].name = name;
  notify();
}

export function setTestCode(ndx, code) {
  data.tests[ndx].code = code;
  notify();
}

export function setTestResult(ndx, results, platform) {
  const test = data.tests[ndx];
  test.results = results;
  test.platforms[platform] = test.platforms[platform] || [];
  test.platforms[platform][ndx] = results;
}

export function deleteTest(ndx) {
  data.tests.splice(ndx, 1);
  notify();
}

export function setData(newData) {
  // TODO: Validate!
  data = newData;
  notify();
  set('updateVersion', get('updateVersion') + 1);
}

export function clearAllTestResults() {
  for (const test of data.tests) {
    test.results = {};
  }
  notify();
}

export function resultsAreValid(results) {
  return results && ! results.error && !results.aborted;
}

export function testResultsAreValid(test) {
  return resultsAreValid(test.results);
}

function formatNumber(number) {
  number = String(number).split('.');
  return `${number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',')}${(number[1] ? `.${number[1]}` : '')}`;
}

export function formatResults(results) {
  const {hz = 0, stats = {numSamples: 0, rme: 0}} = results;
  const opsPerSec = formatNumber(hz.toFixed(hz < 100 ? 2 : 0));
  const plusMinus = stats.rme.toFixed(2);
  return `${opsPerSec} ops/sec ±${plusMinus}% (runs: ${stats.numSamples})`;
}