// server.js

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
          pommel_exec, rings_exec, vault_exec, pbars_exec, hbar_exec
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  var stmt = db.prepare(insertQuery);
  data.forEach(function (row) {
    stmt.run(
      row.gym,
      row.team,
      row.name,
      row.number,
      row.level,
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
