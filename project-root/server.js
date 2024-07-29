const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Connect to SQLite database
let db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Endpoint to check for data leaks
app.post('/check-leak', (req, res) => {
    const type = req.body.type;
    const value = req.body.value;
    
    const sql = `SELECT * FROM leaks WHERE type = ? AND value = ?`;
    
    db.get(sql, [type, value], (err, row) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        
        if (row) {
            res.json({
                leaked: true,
                other_info: row.other_info,
                leak_date: row.leak_date
            });
        } else {
            res.json({ leaked: false });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
