const Prompt = require('../components/Prompt');
const Intervention = require('../components/Intervention');

class StateController {

    static async createCompletion(req, res) {
        const state = {
            prompt: req.body.prompt,
            details: req.body.details || []
        }
        
        console.log(state);
        console.log(req.body);

        if (!state.details || state.details.length < 3) {
            const questionContent = await Prompt.createQuestion(state);
            res.status(200).json({
                type: 'question',
                content: questionContent
            });
        } else {
            const interventionContent = await Intervention.createIntervention(state);
            res.status(200).json({
                type: 'code',
                content: interventionContent
            });
        }
    }

}

module.exports = StateController;