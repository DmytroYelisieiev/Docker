import http from 'http';
import url from 'url';
import { createConnection } from './database.js';

export function createServer() {
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