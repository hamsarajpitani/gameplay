const { parentPort } = require('worker_threads');

parentPort.on('message', ({ key, passIndex, totalPasses, activated, alreadyActive }) => {
  setTimeout(() => {
    parentPort.postMessage({
      key,
      passIndex,
      activated,
      alreadyActive,
      totalPasses,
      status: 'done',
    });
  }, 2000);
});
