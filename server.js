const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = 3001;
const app = express();
const uuid = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
console.log(uuid());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => { 
  fs.readFile('./db/db.json', 'utf8', (err, data) => { 
    if (err) { 
      console.log(err);
      return
    }
    res.json(JSON.parse(data).slice(1))
  })
})

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a review`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedNote = JSON.parse(data);
        parsedNote.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated reviews!")
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, console.log(`Turn to http://localhost:${PORT}`));
