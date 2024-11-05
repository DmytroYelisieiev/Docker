import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getGPTResponse(title) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Напиши предложение до 20 слов: Что вы думаете о следующей ситуации: ${title}`
                }
            ]
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.log('CHATGPT error', error);
        return null;
    }
}

1
