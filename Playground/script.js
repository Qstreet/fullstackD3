



var data = [{
  "State": "VT",
  "Under 5 Years": 32635,
  "5 to 13 Years": 62538,
  "14 to 17 Years": 33757,
  "18 to 24 Years": 61679,
  "25 to 44 Years": 155419,
  "45 to 64 Years": 188593,
  "65 Years and Over": 86649
}, {
  "State": "VA",
  "Under 5 Years": 522672,
  "5 to 13 Years": 887525,
  "14 to 17 Years": 413004,
  "18 to 24 Years": 768475,
  "25 to 44 Years": 2203286,
  "45 to 64 Years": 2033550,
  "65 Years and Over": 940577
}]


// fix pre-processing
var keys = [];

for (key in data[0]) {
  if (key != "State")
    keys.push(key);
}

console.log(keys);

data.forEach(function (d) {
  d.total = 0;
  keys.forEach(function (k) {
    d.total += d[k];
  })
});

window.addEventListener('click', function(event){
  if (event.target.matches('.bone')) {
    alert("one it is")
  } else {
    alert('two')
  }
}, false)

