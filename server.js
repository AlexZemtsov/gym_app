// importLogic.js

// Function to import data into SQLite database
function importToSQLite(data) {
  // SQLite database initialization
  var db = new SQL.Database();

  // Create a table with the specified columns
  var createTableQuery = `
      CREATE TABLE IF NOT EXISTS gymnastics_data (
          id INTEGER PRIMARY KEY,
          gym TEXT,
          team TEXT,
          name TEXT,
          number INTEGER,
          level INTEGER,
          floor_exec REAL,
          pommel_exec REAL,
          rings_exec REAL,
          vault_exec REAL,
          pbars_exec REAL,
          hbar_exec REAL
      );
  `;
  db.run(createTableQuery);

  // Insert data into the table (replace 'data' with your actual data)
  // For each row in 'data', bind the values and execute the insert query
  var insertQuery = `
      INSERT INTO gymnastics_data (
          gym, team, name, number, level,
          floor_exec, pommel_exec, rings_exec, vault_exec, pbars_exec, hbar_exec
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  var stmt = db.prepare(insertQuery);
  data.forEach(function (row) {
    stmt.run(
      row.gym,
      row.team,
      row.name,
      row.number,
      row.level,
      row.floor_exec,
      row.pommel_exec,
      row.rings_exec,
      row.vault_exec,
      row.pbars_exec,
      row.hbar_exec
    );
  });
  stmt.free();

  // Close the database
  var binaryArray = db.export();
  var blob = new Blob([binaryArray], { type: "application/octet-stream" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "gymnastics_data.sqlite";
  link.click();
}

// Function to read the content of the selected CSV file
function readCSV() {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var csvContent = e.target.result;
      processCSVData(csvContent);
    };

    reader.readAsText(file);
  } else {
    alert("Please select a CSV file.");
  }
}

// Function to process the CSV data
function processCSVData(csvContent) {
  // Parse CSV and extract required columns
  // Here, you need to implement your own CSV parsing logic
  // For simplicity, I'll provide a basic example assuming the CSV is well-formed
  var rows = csvContent.split("\n");
  var data = [];

  for (var i = 1; i < rows.length; i++) {
    var columns = rows[i].split(",");
    data.push({
      gym: columns[1],
      team: columns[2],
      name: columns[3],
      number: parseInt(columns[4]),
      level: parseInt(columns[5]),
      floor_exec: parseFloat(columns[6]),
      pommel_exec: parseFloat(columns[7]),
      rings_exec: parseFloat(columns[8]),
      vault_exec: parseFloat(columns[9]),
      pbars_exec: parseFloat(columns[10]),
      hbar_exec: parseFloat(columns[11]),
    });
  }

  console.log(data);
  // At this point, 'data' contains the extracted CSV data
  // You can perform further processing or display the data as needed
}
