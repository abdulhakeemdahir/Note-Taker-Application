var express = require("express");
var path = require("path");
const fs = require("fs");
const { json } = require("express");
let dataDB = require("./db/db.json");
const { nanoid } = require("nanoid");

// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", function (req, res, dataPath) {
  let readData = fs.readFileSync("./db/db.json", "utf8");
  let dataParse = JSON.parse(readData);
  return res.json(dataParse);
});

app.post("/api/notes", function (req, res) {
  let newNote = req.body;
  newNote.id = nanoid();
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes.push(newNote);
    let updatedNotes = JSON.stringify(notes);

    fs.writeFile("./db/db.json", updatedNotes, err => {
      if (err) throw err;
      else {
        return res.json(updatedNotes);
      }
    });
  });
});

app.delete("/api/notes/:id", function (req, res) {
  // Access :ID from req.params.id

  let noteId = req.params.id;
  console.log("NOTE ID: ", noteId);
  // Use the fs module to read the file
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    console.log("NOTES JSON: ", notes);
    let newNote = notes.filter(notes => notes.id !== noteId);
    console.log("NEW NOTE: ", newNote);
    let updatedNotes = JSON.stringify(newNote);

    fs.writeFile("./db/db.json", updatedNotes, err => {
      if (err) throw err;
      else {
        return res.json(updatedNotes);
      }
    });
  });

  // Then use parse the file contents
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
