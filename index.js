import { createConnection } from './src/database.js';
import { parseNurKz } from './src/parser.js'
import { createServer } from './src/server.js'
import waitOn from 'wait-on';
import './src/telegram.js';


let opts = {
  resources: [`tcp:${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`],
  timeout: 30000, 
  interval: 1000,
  window: 1000, 
};

waitOn(opts, async function (err) {
  if (err) {
    console.error('Ошибка при ожидании MySQL:', err);
    return;
  }
  
  try {
    // await createFiles();
    await parseNurKz(); 
    await createServer(); 

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
