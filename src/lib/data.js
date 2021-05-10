const axios = require('axios');

const {getItemListURL, getTrendURL, getOverallInfoURL} = require('./url');
const {Log, Info} = require('./log');


// Abstractions
const _get = (validator, getter) => (urlGetter) => async (param) => {
  const requestUrl = urlGetter(param);
  Info(`param : ${param}`);
  Info(`requestUrl : ${requestUrl}`);
  const response = await axios.get(requestUrl);

  if(validator(response) !== true) {
    throw new Error("No Data");
  }
  const result = getter(response);
  Log(result);
  return result;
}

const jsonValidator = (response) => !!response.data.result && response.data.resultCode === 'success'

const _JsonGet = _get(
  jsonValidator,
  (response) => response.data.result
);

const _JsonItemListGet = _get(
  jsonValidator,
  (response) => response.data.result.itemList
);

const _HtmlGet = _get(
  (response) => !!response.data && response.status === 200,
  (response) => response.data
);

// Implementations
// JSON
const getItemList = _JsonItemListGet(getItemListURL);
const getTrend = _JsonGet(getTrendURL);
// HTML
const getOverallInfo = _HtmlGet(getOverallInfoURL);

module.exports = {
  getItemList,
  getTrend,
  getOverallInfo
};
