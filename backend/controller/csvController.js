const { storeData, getData, removeData } = require('../services/globalServices');
const { parseCSV } = require('../utils/parseCsv');
const { generateTasks, createWorker } = require('../workers/worker');
const { v4: uuidv4 } = require('uuid');

const validateCSV = async (req, res) => {
  try {
    const uuid = uuidv4();
    const csvFileBuffer = req.file.buffer;
    const csvFileContent = csvFileBuffer.toString();
    const io = req.app.get('io');

    const records = await parseCSV(csvFileContent);

    const processObj = {
      validating: '',
      validated: 0,
      totalRecords: records.length || 0,
    };

    const validationFailedIdx = [];

    const validateRecords = async (records, processObj) => {
      for (let index = 0; index < records.length; index++) {
        const record = records[index];
        const keys = Object.keys(record);

        for (const key of keys) {
          if (key.endsWith('*')) {
            if (!record[key]) {
              validationFailedIdx.push(index);
            }
          }
          processObj.validating = key;
          await new Promise((resolve) => setTimeout(() => resolve(), 2000)),
            io.emit('progress', {
              type: 'validating',
              ...processObj,
              validated: processObj.validated + 1,
              message: `Validating ${processObj.validated + 1} / ${
                processObj.totalRecords
              } records. Now validating ${processObj.validating}.`,
            });
        }
        processObj.validated++;
      }
    };

    await validateRecords(records, processObj);

    const validRecords = records.filter(
      (record, index) => !validationFailedIdx.includes(index),
    );

    storeData(uuid, validRecords);

    io.emit('askForConsent', {
      failedRecords: validationFailedIdx.length,
      successRecords: validRecords,
      uuid,
    });

    res.status(200).json({ message: 'Validated' });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const processCSV = async (req, res) => {
  const { uuid: globalId } = req.params;
  const io = req.app.get('io');

  try {
    const validRecords = getData(globalId);
    const taskGenerator = generateTasks(validRecords);
    const numWorkers = 2;
    Array.from({ length: numWorkers }, () => createWorker(taskGenerator, io, globalId));
    res.status(200).json({ msg: 'csv Processed successFully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during processing');
  }
};

const removeCsvRecord = async (req, res) => {
  const { uuid: globalId } = req.params;
  try {
    globalId && removeData(globalId);
    res.status(200).json({ msg: 'removed successFully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during processing');
  }
};

module.exports = { validateCSV, processCSV, removeCsvRecord };
