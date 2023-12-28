const { Worker } = require('worker_threads');
const { removeData } = require('../services/globalServices');

function* generateTasks(validRecords) {
  let activated = 0;
  let alreadyActive = 0;

  for (let passIndex = 0; passIndex < validRecords?.length; passIndex++) {
    const record = validRecords[passIndex];
    const keys = Object.keys(record);

    for (const key of keys) {
      if (key === 'ACTIVE') {
        const currentTimestamp = new Date().getTime();
        const modValue = currentTimestamp % 2;
        const isActive = Number(record[key]) === 1;
        const shouldActivate = modValue === 0;
        if (isActive) {
          alreadyActive += 1;
          shouldActivate && (record[key] = 0);
        } else {
          shouldActivate && (record[key] = 1);
          activated += 1;
        }
      }

      yield {
        key,
        passIndex,
        activated,
        alreadyActive,
        totalPasses: validRecords.length,
      };
    }
  }
}

function createWorker(taskGenerator, io, globalId) {
  const worker = new Worker(__dirname + '/parentPort.js');

  worker.on('message', (msg) => {
    io.emit('progress', {
      type: 'processing',
      processed: msg.passIndex + 1,
      totalRecords: msg.totalPasses,
      activated: msg.activated,
      alreadyActive: msg.alreadyActive,
      message: `Processing ${msg.passIndex + 1}/${msg.totalPasses}. Processed ${
        msg.key
      }.`,
    });

    const nextTask = taskGenerator.next();
    if (nextTask.done) {
      worker.terminate();
      removeData(globalId);
    } else {
      worker.postMessage(nextTask.value);
    }
  });

  const firstTask = taskGenerator.next();
  if (!firstTask.done) {
    worker.postMessage(firstTask.value);
  }

  return worker;
}

module.exports = { createWorker, generateTasks };
