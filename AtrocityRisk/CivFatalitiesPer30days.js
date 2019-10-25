/*!
* AtrocityRisk/CivFatalitiesPer30days.js
* Count Civ Fatalities per 30 day period. Over or Under 100.
* (c) 2019, CSO
* MIT License
* d3.js
*/

(async function () {
'use strict';

  // Create parsers to convert dates in ACLED string format into javascript Date object and back into string as needed.
  const dateParser = d3.timeParse('%Y-%m-%d')
  const formatTime = d3.timeFormat('%Y-%m-%d')

const earlyDate = new Date("2019-07-02")
const earliestDate = formatTime(earlyDate)

const lateDate = new Date("2019-08-01")
const latestDate = formatTime(lateDate)


const q3Months = {
  m1: formatTime(new Date("2019-07-02")) + "|" + formatTime(new Date("2019-08-01")),
  m2: formatTime(new Date("2019-08-02")) + "|" + formatTime(new Date("2019-09-01")),
  m3: formatTime(new Date("2019-09-02")) + "|" + formatTime(new Date("2019-10-01"))
}

let isoCode = 4

// const jsonData =
// `https://api.acleddata.com/acled/read?terms=accept&iso=${acledMetrics.countryISO}&event_type=Protests:OR:event_type=Riots:OR:event_type=Violence_against_civilians&event_date=${encodeURIComponent(dateRange)}&event_date_where=BETWEEN`

// const baseURL = 
// `https://api.acleddata.com/acled/read?terms=accept&iso=${isoCode}&event_type=Violence%20against%20civilians:OR:sub_event_type=Excessive%20force%20against%20protesters:OR:sub_event_type=Suicide%20bomb&event_date=${encodeURIComponent(dateRange)}&event_date_where=BETWEEN`

const baseURL = 
// `https://api.acleddata.com/acled/read.csv?terms=accept&iso=140&event_type=Violence%20against%20civilians:OR:sub_event_type=Excessive%20force%20against%20protesters:OR:sub_event_type=Suicide%20bomb&event_date=${encodeURIComponent(q3Months.m1)}&event_date_where=BETWEEN`
`https://api.acleddata.com/acled/read.csv?terms=accept&iso=716&event_type=Violence%20against%20civilians:OR:sub_event_type=Excessive%20force%20against%20protesters:OR:sub_event_type=Suicide%20bomb&event_date=2019-07-02|2019-10-01&event_date_where=BETWEEN`

// const callBase = await d3.json(baseURL)

// const isoList = await d3.csv('./ACLEDCountryISO.csv')
// console.log(isoList);

let responseISO = await fetch('./CountryISO.json')
let isoList = await responseISO.json()
// // console.log(isoList);


// let responseJSON = await fetch(baseURL)
// let acledJson = await responseJSON.json()


let arrayChart = [];

isoList.forEach(async function(record, index){
  const q11 = await d3.json(`https://api.acleddata.com/acled/read?terms=accept&iso=${record.ISO}&event_type=Violence%20against%20civilians:OR:sub_event_type=Excessive%20force%20against%20protesters:OR:sub_event_type=Suicide%20bomb&event_date=${encodeURIComponent(q3Months.m2)}&event_date_where=BETWEEN`)
  let total = 0
  for (var i=0; i < q11.length; i++) {
    total = total + parseInt(i[28])
    console.log(total);
  }

  // arrayChart.push([record.Country, record.ISO, q11])



})
  // console.log(arrayChart);



})();