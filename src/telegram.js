import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });

console.log("Bot starting...");

bot.on("polling_error", (error) => {
    console.error("error", error);
});

bot.onText(/\/start/, (msg) => {
    console.log("get /start ");
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello! Write down an ID ");
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (/^\d+$/.test(text)) {
        const id = text;

        try {
            const response = await fetch(`http://localhost:3000/title?id=${id}`);

            if (!response.ok) {
                throw new Error(`Error request API: ${response.statusText}`);
            }

            const title = await response.json();

            const message = `
*Title:* ${title.title}

*Answer:* ${title.answer}
`;

            bot.sendMessage(chatId, message, {parse_mode: 'Markdown'});

        } catch (error) {
            console.error("get erroor", error);
            bot.sendMessage(chatId, "Error to get info");
        }
    }
});

