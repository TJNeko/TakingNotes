const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const readNotesFromFile = () => {
  const filePath = path.join(__dirname, 'db', 'db.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};
const writeNotesToFile = (notes) => {
  const filePath = path.join(__dirname, 'db', 'db.json');
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });

  app.get('/api/notes', (req, res) => {
    try {
      const notes = readNotesFromFile();
      res.json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/notes', (req, res) => {
    try {
      const newNote = req.body;
      newNote.id = uuidv4();
      const notes = readNotesFromFile();
      notes.push(newNote);
      writeNotesToFile(notes);
      res.json(newNote);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/notes/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    let notes = readNotesFromFile();
    notes = notes.filter((note) => note.id !== noteId);
    writeNotesToFile(notes);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
