# stockToyProj

네이버 금웅을 살짝 빌려보자  

TDD 해야 하는데.. 그냥 일단 일변도로 간다.  
우선 로컬에서 만들고 되면 Azure 로 올린다.

## 블로깅
[0000](https://changbaebang.github.io/2021-04-26-toy-project-0000/)   
[0001](https://changbaebang.github.io/2021-04-27-toy-project-0001/)  
[0002](https://changbaebang.github.io/2021-04-29-toy-project-0002/)  
[0003](https://changbaebang.github.io/2021-05-09-toy-project-0003/)  


## 기술 조사

### 코스피 시총 100 위를 긁어 올 수 있는 가?
* 가능 => https://m.stock.naver.com/api/json/sise/siseListJson.nhn?menu=market_sum&sosok=0&pageSize=100&page=1
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
* 가능 > https://m.stock.naver.com/api/item/getTrendList.nhn?code=005930&size=1
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
* 가능 => https://m.stock.naver.com/api/html/item/getOverallInfo.nhn?code=005930
파싱해서 쓰자
=> 종목 분석 및 기사는 타이틀만 해서 머신 러닝을 해도 좋을 듯... 이번엔 패스
=> 컨센서스 가격 및 rate 를 파싱해서 가져올 수 있음
