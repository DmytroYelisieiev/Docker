import axios from 'axios';
import * as cheerio from 'cheerio';
import { createConnection, insertUniqueTitle } from './database.js';

export async function parseNurKz() {
  const url = 'https://nur.kz/';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const newsItems = $('._blockTopImportantItem_he0uz_1')
      .map((index, element) => {
        let title = $(element).text().trim();
        return title.replace(/\d{2}:\d{2}$/, '').trim();
      })
      .get()
      .filter(title => title);
    
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