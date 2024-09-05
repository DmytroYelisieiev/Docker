import fs from 'node:fs';
import http from 'node:http';
import mysql from 'mysql2';
import waitOn from 'wait-on'

const path = "file";
const content = "Hello world!";
const errorDir = "Error to create Directory";
const dirCreated = 'Directory is created';
const errorFile = "Error to create file";
const fileCreated = "File is created";
const dirfile = "file/Hello.txt";


let opts = {
  resources: [`tcp:${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`],
  timeout: 30000, 
  interval: 1000,
  window: 1000, 
};

waitOn(opts, function (err) {
  if (err) {
    return handleError(err);
  }
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
});


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
