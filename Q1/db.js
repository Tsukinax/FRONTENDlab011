const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'student',
    password: 'student123',
    database: 'school_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL!');

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS students (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            age INT CHECK (age BETWEEN 18 AND 30),
            grade FLOAT CHECK (grade BETWEEN 0 AND 100)
        )
    `;
    connection.query(createTableSQL, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "students" is ready.');
        }
    });
});

module.exports = connection;