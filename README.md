# D3 Project

## Ideas
* lollipop chart spanning dif btwn USD$ and UK£
£ OPT/ALT + 3

* Circle chart inner vs outer ring are two exhanges
mark historical timeline
 https://datavizproject.com/data-type/scaled-timeline/

 * dumbell chart
 range of ken shilling ex on top
 two rates linked by dumbell. wider and more narrow
 historical notes on left
 https://datavizproject.com/data-type/dumbbell-plot/
 https://informationisbeautiful.net/visualizations/gender-pay-gap/

 join kenya data into one big csv and put a note into key dates
 - brexit
 - ken elections
 - 

 ## Map of school dirstricts
 saved on fan.gov

 ## Link to Google Sheets as data source
 https://www.benlcollins.com/spreadsheets/d3-google-sheets/

 [Link](https://groups.google.com/d/msg/d3-js/gjI74b4BNLU/bvUhsNGYAwAJ)

 building the viz in Google Apps Script.  You have native connection to Google Spreadsheets (using the SpreadsheetApp Class) which will automatically convert data to JSON.  Here's the basic file structure I'd use:

code.gs
```
function getData(){
 var sheet = SpreadsheetApp.openById("asdfghjkl1234567890");
    //get desired range
 return data;
}

function doGet(){
 return HtmlService.createTemplateFromFile('index')
   .evaluate()
   .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

index.html
<script>
google.script.run.withSuccessHandler(makeViz).getData();
function makeViz(data){
  //put your d3 here
}
</script>
```

## JSON Links
https://opendata.arcgis.com/datasets/bbcd64cbce5347189ead08c23d6a0d38_0/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json



