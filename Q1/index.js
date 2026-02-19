const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public')); 


app.get('/students', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM students');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/students', async (req, res) => {
    try {
        const { name, age, grade } = req.body;
  
        if (age < 18 || age > 30) return res.status(400).json({ error: 'Age must be 18-30' });
        if (grade < 0 || grade > 100) return res.status(400).json({ error: 'Grade must be 0-100' });

        const [result] = await db.promise().query(
            'INSERT INTO students (name, age, grade) VALUES (?, ?, ?)',
            [name, age, grade]
        );
        res.status(201).json({ message: 'Student created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { grade } = req.body;

        if (grade < 0 || grade > 100) return res.status(400).json({ error: 'Grade must be 0-100' });

        await db.promise().query('UPDATE students SET grade = ? WHERE id = ?', [grade, id]);
        res.json({ message: 'Student grade updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.promise().query('DELETE FROM students WHERE id = ?', [id]);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
