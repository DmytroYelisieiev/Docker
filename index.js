import fs from 'node:fs';
import http from 'node:http';
import mysql from 'mysql2';

const path = "file";
const content = "Hello world!";
const errorDir = "Error to create Directory";
const dirCreated = 'Directory is created';
const errorFile = "Error to create file";
const fileCreated = "File is created";
const dirfile = "file/Hello.txt";

setTimeout(() => {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST, 
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL successfully');

    const currentTime = new Date().toISOString();
    connection.query('INSERT INTO my_table (text) VALUES (?)', [`Я выполнил свою задачу в ${currentTime}`],
    (error) => {
      if (error) {
        console.error('Error inserting data:', error.stack);
      } else {
        console.log('Data inserted successfully');
      }
    });
    
    let query = 'SELECT * FROM my_table';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error selecting data:', error.stack);
      } else {
        console.log('Data from my_table:', results);
      }
      connection.end();
    });
  });
}, 10000);


fs.mkdir(path, (error) => {
  if (error) {
    console.error(errorDir, error);
    return;
  }
  console.log(dirCreated);
});

fs.writeFile(dirfile, content, (error) => {
  if (error) { 
    console.error(errorFile, error);
    return;
  }
  console.log(fileCreated);
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

