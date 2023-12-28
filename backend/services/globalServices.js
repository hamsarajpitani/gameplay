let GlobalData = {};

const storeData = (key, data) => {
  GlobalData[key] = data;
};

const getData = (key) => {
  return GlobalData[key];
};

const removeData = (key) => {
  if (!GlobalData[key]) return;
  delete GlobalData[key];
};

module.exports = { storeData, getData, removeData };
