// Require all of the requisite modules
let express = require("express");
let path = require("path");
const fs = require("fs");
const { json } = require("express");
let dataDB = require("./db/db.json");
const { nanoid } = require("nanoid");

// Tells node that we are creating an "express" server
let app = express();

// Sets an initial port. We"ll use this later in our listener
let PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//Create the GET route
app.get("/api/notes", function (req, res, dataPath) {
  let readData = fs.readFileSync("./db/db.json", "utf8");
  let dataParse = JSON.parse(readData);
  return res.json(dataParse);
});
// Create the POST route
app.post("/api/notes", function (req, res) {
  let newNote = req.body;
  // Add the random generator for the ID
  newNote.id = nanoid();
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    // Parse the data into an object
    notes.push(newNote);
    let updatedNotes = JSON.stringify(notes);
    // Write the new post into db.json
    fs.writeFile("./db/db.json", updatedNotes, err => {
      if (err) throw err;
      else {
        return res.json(updatedNotes);
      }
    });
  });
});
// Create the DELETE route
app.delete("/api/notes/:id", function (req, res) {
  // Access :ID from req.params.id
  let noteId = req.params.id;
  // Use the fs module to read the file
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    // Then use parse the file contents
    let notes = JSON.parse(data);
    // Use filter to remove the selected item
    let newNote = notes.filter(notes => notes.id !== noteId);
    let updatedNotes = JSON.stringify(newNote);
    // Write the new array into the db.json
    fs.writeFile("./db/db.json", updatedNotes, err => {
      if (err) throw err;
      else {
        return res.json(updatedNotes);
      }
    });
  });
});
// Create the /notes route
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
// Create the * route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
// Create the app.listen
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
