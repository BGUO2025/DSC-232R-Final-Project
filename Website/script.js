// STAR RATING DISTRIBUTION

new Chart(document.getElementById("ratingChart"),{

type:"bar",

data:{
labels:["1","2","3","4","5"],

datasets:[{
label:"Number of Reviews",

data:[6000000,8000000,9000000,17680000,62610000]
}]
}

});


// VERIFIED PURCHASE

new Chart(document.getElementById("verifiedChart"),{

type:"doughnut",

data:{
labels:["Verified","Not Verified"],

datasets:[{
data:[85,15]
}]
}

});


// HELPFUL VOTES

new Chart(document.getElementById("helpfulChart"),{

type:"line",

data:{
labels:["0","1","5","10","50","100"],

datasets:[{
label:"Helpful Votes Frequency",

data:[50000000,20000000,10000000,4000000,1000000,200000]
}]
}

});