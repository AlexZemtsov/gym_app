const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static("public"));

app.post("/import", upload.single("csvFile"), (req, res) => {
  const fileBuffer = req.file.buffer.toString();

  // Process the CSV data and insert into SQLite database
  const db = new sqlite3.Database("database.db");

  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS my_table (column1 TEXT, column2 TEXT, column3 TEXT)"
    );

    const stmt = db.prepare("INSERT INTO my_table VALUES (?, ?, ?)");

    const results = [];

    require("stream")
      .Readable.from(fileBuffer.split("\n"))
      .pipe(csv())
      .on("data", (row) => {
        stmt.run(row.column1, row.column2, row.column3);
      })
      .on("end", () => {
        stmt.finalize();

        db.all("SELECT * FROM my_table", (err, rows) => {
          if (err) {
            console.error(err.message);
            res.status(500).json({ message: "Error importing CSV." });
          } else {
            console.log(rows);
            res.json({ message: "CSV imported successfully." });
          }
        });

        db.close();
      });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
