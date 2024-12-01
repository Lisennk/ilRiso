const llmClient = require('../util/openRouterApiClient');
const config = require('config');
const modelName = config.get('generalModelName') || 'nvidia/llama-3.1-nemotron-70b-instruct';

class Prompt {
    static async createQuestion(state) {
        console.log(state);
        const messages = [
            {
                role: 'system',
                content: `You are an AI specializing in triage and mental health. Your task is to generate questions that will help clarify a patient's situation and guide me in offering appropriate support. You will be given a description of a patient's issue, and your goal is to create a question that will provide deeper insight into their condition.`
            },
            {
                role: 'user',
                content: `Here is the patient's issue:
<patient_issue>
${state.prompt}
</patient_issue>

Generate a question that will help me clarify their situation and assist in tailoring an intervention I am are preparing for them. I will send this question to the patient. Do not create compound questions.

Try to avoid yes/no questions or overly broad ones. Make sure your questions are as specific as possible.

At this time, generate only question. Do not output anything except the question. Your response should be exactly one sentence.`
            }
        ];

        state.details.forEach(detail => {
            messages.push({
                role: 'assistant',
                content: detail.question
            });

            messages.push({
                role: 'user',
                content: `The user's answer to the question above is:

"${detail.response}"

Generate another question. You can either explore the line you already started or ask something else. This may or may not be the last opportunity to ask them a question before I proceed with my advice.

Output only 1 question. Your question should consist of 1 sentence. Do not output anything else.`
            });

        });

        console.log(messages);

        const completion = await llmClient.chat.completions.create({
            model: modelName,
            messages: messages
        });

        return completion.choices[0].message.content; 
    }
}

module.exports = Prompt;