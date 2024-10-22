import fs from 'node:fs';
import mysql from 'mysql2/promise';
import waitOn from 'wait-on';
import axios from 'axios';
import * as cheerio from 'cheerio';
import http from 'http';
import url from 'url';

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

async function createConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST, 
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });
}

async function parseNurKz() {
  const url = 'https://nur.kz/';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const newsItems = $('._blockTopImportantItem_he0uz_1')
      .map((element) => {
        let title = $(element).text().trim();
        return title.replace(/\d{2}:\d{2}$/, '').trim();
      })
      .get()
      .filter(title => title)
    
    console.log(`\n ${newsItems.length} новостей`);
    
    const connection = await createConnection();
    try {
      for (const title of newsItems) {
        await insertUniqueTitle(connection, title);
      }
      console.log('Уникальные заголовки сохранены в базе данных.');
    } finally {
      await connection.end();
    }
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
  
  try {

    await parseNurKz();
    
    createServer();

    const connection = await createConnection();
    try {
      const [results] = await connection.execute('SELECT * FROM news_titles ORDER BY id');
      console.log('Данные из таблицы news_titles:', results);
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error:', error);
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

function createServer() {
  const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (req.method === 'GET' && reqUrl.pathname === '/title') {
      const id = reqUrl.query.id;

      if (!id) {
        res.statusCode = 400;
        res.end('Bad Request');
        return;
      }

      let connection;
      try {
        connection = await createConnection();
        const [results] = await connection.execute('SELECT * FROM news_titles WHERE id = ?', [id]);

        if (results.length === 0) {
          res.statusCode = 404;
          res.end('Not found');
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(results[0]));
        }
      } catch {
        res.statusCode = 500;
        res.end('Connection error');
      } finally {
        if (connection) {
          await connection.end();
        }
      }
    } 
  });

  server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
  });
}