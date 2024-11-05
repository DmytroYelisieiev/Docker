import http from 'http';
import url from 'url';
import { createConnection } from './database.js';
import { getGPTResponse } from './chatgpt.js'

async function updateTitleAnswer(connection, id, answer) {
  try {
    await connection.execute(
        'UPDATE news_titles SET answer = ? WHERE id = ?',
        [answer, id]
    );
    return true;
  } catch (error) {
    console.error('Update error', error.message);
    return false;
  }
}

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
          return;
        }

        const title = results[0];

        if (!title.answer) {
          const gptResponse = await getGPTResponse(title.title);
          if (gptResponse) {
            await updateTitleAnswer(connection, id, gptResponse);
            title.answer = gptResponse;
          }
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(title));


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