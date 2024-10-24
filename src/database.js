import mysql from 'mysql2/promise';

export async function createConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST, 
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });
}

export async function insertUniqueTitle(connection, title) {
  try {
    await connection.execute(
      'INSERT IGNORE INTO news_titles (title) VALUES (?)',
      [title]
    );
  } catch (error) {
    console.error('Ошибка при вставке заголовка:', error.message);
  }
}