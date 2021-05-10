const {getItemList} = require('./lib/data');
const {getReasonableItemList} = require('./lib/debone');
const {count} = require('./static/info.json').item;
const _ = require('lodash');

(async () => {
  // IN 종목 수
  // OUT 컨센서스 낮은 종목 출력

  // 상위 종목 가져오기
  console.info(`In TOP: ${count}`);
  const itemList = await getItemList(count);

  // 조건에 맞는 종목으로 필터
  const reasonableItemList = await getReasonableItemList(itemList);

  console.info('========== OUTPUT ==========');
  _.forEach(reasonableItemList, (item) => {
    console.info(`${item.nm} \t|${item.nv}\t|${item.concensus}\t|${item.rate}\t|${item.ratio}`);
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