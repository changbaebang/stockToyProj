const {base, siseListJson, trendList, overallInfo} = require('../static/info.json').api;

// Abstractions
const getURL = (_base, detail) => (item) => `${_base}${detail(item)}`

// Implementations
const getItemListURL = getURL(base, (size) => `${siseListJson}?menu=market_sum&sosok=0&pageSize=${size}&page=1`);
const getTrendURL = getURL(base, (code) => `${trendList}?code=${code}&size=1`);
const getOverallInfoURL = getURL(base, (code) => `${overallInfo}?code=${code}`);

module.exports = {
  getItemListURL,
  getTrendURL,
  getOverallInfoURL
};
