import fs from 'node:fs';
import mysql from 'mysql2/promise';
import waitOn from 'wait-on';
import axios from 'axios';
import * as cheerio from 'cheerio';

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

async function parseNurKz(connection) {
  const url = 'https://nur.kz/';

  try {
    
    const response = await axios.get(url);
    
    const $ = cheerio.load(response.data);
    
    const newsItems = $('._title_1th24_9')
      .map((index, element) => $(element).text().trim())
      .get();

    console.log(`\n ${newsItems.length} новостей:`);
    for (const title of newsItems) {
      await insertUniqueTitle(connection, title);
    }

    console.log('Уникальные заголовки сохранены в базе данных.');
  } catch (error) {
    console.error('Ошибка при парсинге данных:', error.message);
  }
}

async function insertUniqueTitle(connection, title) {
  try {
    await connection.execute(
      'INSERT IGNORE INTO news_titles (title) VALUES (?)',
      [title]
    );
  } catch (error) {
    console.error('Ошибка при вставке заголовка:', error.message);
  }
}

waitOn(opts, async function (err) {
  if (err) {
    console.error('Ошибка при ожидании MySQL:', err);
    return;
  }
  
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST, 
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });

    console.log('Connected to MySQL successfully');

    // Вывод данных из таблицы news_titles

    await parseNurKz(connection);

    const [results] = await connection.execute('SELECT * FROM news_titles');
    console.log('Данные из таблицы news_titles:', results);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
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
