const axios = require('axios');
const _ = require('lodash');
const cheerio = require("cheerio");


const NV = "https://m.stock.naver.com/api";
const getURL = (base, detail) => (item) => `${base}${detail(item)}`
const getItemListURL = getURL(NV, (size) => `/json/sise/siseListJson.nhn?menu=market_sum&sosok=0&pageSize=${size}&page=1`);
const getTrendURL = getURL(NV, (code) => `/item/getTrendList.nhn?code=${code}&size=1`);
const getOverallInfoURL = getURL(NV, (code) => `/html/item/getOverallInfo.nhn?code=${code}`);


// Get List
const getItemList = async (count) => {
  const response = await axios.get(getItemListURL(count));
  //console.log(response);

  if(!response.data.result || response.data.resultCode !== 'success') {
    throw new Error("No Data");
  }
  //console.log(response);
  const result = response.data.result;
  //console.info(result);
  return result;
};


// Get Trend
const getTrend = async (code) => {
  const response = await axios.get(getTrendURL(code));
  //console.log(response);

  if(!response.data.result || response.data.resultCode !== 'success') {
    throw new Error("No Data");
  }
  //console.log(response);
  const result = response.data.result;
  //console.info(result);
  return result;
};


// Get Ovaral
const getOverallInfo = async (code) => {
  const response = await axios.get(getOverallInfoURL(code));
  //console.log(response);

  if(!response.data || response.status !== 200) {
  // if(!response.data.result || response.data.resultCode !== 'success') {
    throw new Error("No Data");
  }
  //console.log(response);
  //const result = response.data.result;
  const result = response.data;
  //console.info(result);
  return result;
};


/*
<div class="ct_box opinion">
  <div class="graph_area _graph_area step4">
    <div class="graph_base">
      <div class="graph_data _graph_data">
        <span class="data_lyr _data_lyr" style="left:69%">
          3.95
        <span class="arrow"></span>
        </span>
      </div>
    </div>
  </div>
  <div class="goal_area">
    <span class="goal_stock">
      <span class="goal">목표주가</span>
        <em class="stock_price">105,909<span class="type">원</span></em>
      </span>
  </div>
*/
const getGoal = (html_content) => {
  const $ = cheerio.load(html_content);
  const rates = $('span.data_lyr._data_lyr');
  //console.info(rates.length);
  //console.info(rates.text());
  const stock_prices = $('em.stock_price');
  //console.info(stock_prices.length);
  const result = _.parseInt(_.join(_.split(stock_prices.text(), /,|원/i), ""));
  return result;
};




(async () => {
  const ListCount = 300;

  // IN 종목 수
  // OUT 컨센서스 낮은 종목 출력
  const result = await getItemList(ListCount);
  const itemList = result.itemList;
  await _.forEach(itemList, async (item) => {
    // console.log(`name : ${item.nm}`);
    // console.log(`code : ${item.cd}`);
    // console.log(`value: ${item.nv}`);
    try {
      const code = item.cd;
      //const trand = await getTrend(code);
      const overallInfo = await getOverallInfo(code);
      //console.info(overallInfo);
      const goal = getGoal(overallInfo);
      const rate = _.floor((goal/item.nv*100)-100, 2);

      if (rate > 100) {
        console.log(`name : ${item.nm} value: ${item.nv} goal: ${goal} ${rate}`);
      }

    } catch (error) {
      console.error(error);
    }

  });
})();

/*
```
{
cd": "005930", // 종목 번호
"nm": "삼성전자", // 이름
"mt": "0",
"nv": 82900,  // 가격
"cv": -600,   // 등락
"cr": -0.72,  // 등락률
"rf": "5",
"pcv": 83500,
"mks": 4948950,
"aq": 12893360,
"aa": 1067392,
"ms": "CLOSE"
}
```
각 종목의 지표를 가져올 수 있는가?
* 가능 > 
```
{
"result":[
{
"change_val": -600,
"frgn_stock": 3263809913,
"frgn_pure_buy_quant": -1878015,
"frgn_hold_ratio": 54.6721741648697,
"acc_quant": 12893360,
"bizdate": "20210427",
"risefall": "5",
"itemcode": "005930",
"listed_stock": 5969782,
"close_val": 82900,
"sosok": "01",
"organ_pure_buy_quant": -759474,
"indi_pure_buy_quant": 2653560
}
],
"resultCode": "success"
}
```
무언가 차이를 계산할 수 있는가?
=> 컨센서스 얻어오자가
* 가능 => ttps://m.stock.naver.com/api/html/item/getOverallInfo.nhn?code=005930
*/