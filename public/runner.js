/* global Benchmark */
/* global model */

const benchmarkToData = b => {
  const stats = {
    ...(b.stats && b.stats),
    numSamples: b.stats ? b.stats.sample.length : 0,
  };
  delete stats.sample;
  return {
    aborted: b.aborted,
    //compiled: b.compiled,
    id: b.id,
    name: b.name,
    count: b.count,
    cycles: b.cycles,
    hz: b.hz,
    stats,
    ...(b.times && {times: {...b.times}}),
    ...(b.error && {error: {...b.error}}),
  };
};

const suite = new Benchmark.Suite('WTF', {
  onAbort: () => {},
  onError: (e) => {
    const data = benchmarkToData(e.target);
    window.parent.postMessage({type: 'error', data}, "*");
  },
  onCycle: (e) => {
    const data = benchmarkToData(e.target);
    window.parent.postMessage({type: 'cycle', data}, "*");
  },
  onComplete: (e) => {
    const data = e.currentTarget.map(benchmarkToData);
    window.parent.postMessage({type: 'complete', data}, "*");
  },
});
model.tests.forEach((test, i) => suite.add({
  name: `${i}`,
  fn: test.code,
}));
Benchmark.prototype.setup = model.setup;
suite.run({
  async: true,
  defer: true,
});
