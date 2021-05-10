const cheerio = require('cheerio');
const _ = require('lodash');

const info = require('../static/info.json');
const {rate, price} = info.overallInfo;
const {itemExclues, concensusRate, concensusRatio} = info.item;
const {getOverallInfo, getTrend} = require('./data');
const {Info} = require('./log');

// Abstractions

// Implementations
const nameFilter = (item) => {
    const name = item.nm;
    return _.every(itemExclues, (exclue) => !_.includes(name, exclue));
};

const concensusFilter = (item) =>  !!item.concensus && !!item.rate && item.ratio >= concensusRatio && item.rate >= concensusRate

const trendFilter = (item) => {
  const change_val_rate = _.floor((item.change_val/item.nv*100), 2);
  if (change_val_rate < -1.0)
    return false;

  return item.frgn_pure_buy_quant > 0;// || item.organ_pure_buy_quant > 0;
}

const getConsensus = (html_content) => {
  const $ = cheerio.load(html_content);
  const rates = $(rate.finder);
  const _rate = parseFloat(rates.text());
  Info(`rate : ${_rate} | ${typeof _rate}`);

  const _prices = $(price.finder);
  const _prices_filter = new RegExp(_.join(price.ignores, '|'), 'i');
  const _prices_text = _prices.text();

  const _price = _.parseInt(_.join(_.split(_prices_text, _prices_filter), ""));
  Info(`price : ${_price}`);
  return {
    concensus: _price,
    rate: _rate
  };
};


const appendConsensus = async (item) => {
  const code = item.cd;
  const overallInfo = await getOverallInfo(code);
  const {concensus, rate} = getConsensus(overallInfo);
  const ratio = _.floor((concensus/item.nv*100)-100, 2);
  Info(`${code} | ${item.nm} |  ${item.nv} | ${concensus} | ${rate} | ${ratio}`);

  return {
    ...item,
    concensus,
    ratio,
    rate
  };
};

const appendTrend = async (item) => {
  const code = item.cd;
  const trends = await getTrend(code);
  const {
    change_val, // 등락
    frgn_pure_buy_quant, // 외국인 팔자
    organ_pure_buy_quant, // 기관 사자
    indi_pure_buy_quant // 개인 사자
  } = trends[0];
  return {
    ...item,
    change_val, // 등락
    frgn_pure_buy_quant, // 외국인 팔자
    organ_pure_buy_quant, // 기관 사자
    indi_pure_buy_quant // 개인 사자
  };
  
}

const getReasonableItemList = async (itemList) => {
  Info(`itemList: ${itemList.length}`);

  // 이름 필터
  const itemListWithNameFilter = _.filter(itemList, nameFilter);
  Info(`itemListWithNameFilter: ${itemListWithNameFilter.length}`);

  // 컨센서스 추가
  const itemListWithConsensus = await Promise.all(_.map(itemListWithNameFilter, appendConsensus));
  Info(`itemListWithConsensus: ${itemListWithConsensus.length}`);

  // 컨센서스 필터
  const itemListWithValidConsensus = _.filter(itemListWithConsensus, concensusFilter);
  Info(`itemListWithValidConsensus: ${itemListWithValidConsensus.length}`);
  
  // 종목 정보 추가
  const itemListWithTrend = await Promise.all(_.map(itemListWithValidConsensus, appendTrend));
  Info(`itemListWithTrend: ${itemListWithTrend.length}`);

  // 종목 필터
  const itemListWithValidTrend = _.filter(itemListWithTrend, trendFilter);
  Info(`itemListWithValidTrend: ${itemListWithValidTrend.length}`);


  // 정렬하여 반환
  return _.sortBy(itemListWithValidTrend, (item) => -1 * item.ratio);
};

module.exports = {
  getReasonableItemList
};
