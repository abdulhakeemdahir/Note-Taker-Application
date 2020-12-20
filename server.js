var express = require("express");
var path = require("path");
const fs = require("fs");
const { json } = require("express");

// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", function (req, res, dataPath) {
  const readData = fs.readFileSync("./db/db.json", "utf8");
  let dataParse = JSON.parse(readData);
  console.log(dataParse);
  return res.json(dataParse);
});

// // app.post("/api/notes", function (req, res) {
// //   const newReservation = req.body;
// //   console.log(req.body);
// //   database.push(newReservation);

// //   res.json(newReservation);
// // });

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
