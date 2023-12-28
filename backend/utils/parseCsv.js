const csvParse = require('csv-parse');

const parseCSV = async (csvContent) => {
  return new Promise((resolve, reject) => {
    csvParse.parse(csvContent, { columns: true }, (err, records) => {
      if (err) reject(err);
      resolve(records);
    });
  });
};

module.exports = { parseCSV };
