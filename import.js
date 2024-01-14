// import the fs and csv-parse modules
const fs = require("fs");
const { parse } = require("csv-parse");

// read the CSV file
fs.createReadStream("./gymnasts.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log(row);
  });
