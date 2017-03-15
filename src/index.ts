var ConversationV1 = require('watson-developer-cloud/conversation/v1');

import { IIntentRecognizer, IIntentRecognizerResult, IIntent, IEntity } from 'botbuilder'

export class WatsonRecognizer implements IIntentRecognizer {

    conversation: any;
    onRecognizeCallback: any;
    private intentThreshold: number;

    constructor(private username: string, private password: string, private workspace: string, intentThreshold: number) {

        this.intentThreshold = intentThreshold;
        this.conversation = new ConversationV1({
            username: username,
            password: password,
            version_date: ConversationV1.VERSION_DATE_2016_09_20
        });

    };

    setCallback(onRecognizeCallback: any) {
        this.onRecognizeCallback = onRecognizeCallback;
    };

    recognize(context, callback) {

        // Disable bot responses to talk to human.

        if (context.message.user.handOff) {
            return;
        }

        var result: IIntentRecognizerResult = { score: 0.0, intent: null };

        if (context && context.message && context.message.text) {
            let textClean = context.message.text.replace(/(\r\n|\n|\r)/gm, " ")
            this.conversation.message({
                input: { text: textClean },
                workspace_id: this.workspace
            }, (err, response) => {

                if (!err) {

                    // map entities to botbuilder format

                    result.entities = (response.entities as Array<any>).map<IEntity>(e => ({ type: e.entity, entity: e.value, startIndex: e.location[0], endIndex: e.location[1] }))

                    // map intents to botbuilder format

                    result.intents = (response.intents as Array<any>).map<IIntent>(i => ({ intent: i.intent, score: i.confidence }))

                    let top = result.intents.sort((a, b) => a.score - b.score)[0]

                    //filter intents with less than intentThreshold
                    result.score = top.score < this.intentThreshold ? 0 : top.score;
                    result.intent = top.intent;

                    //Add intent and score to message object
                    context.message.intent = result.intent;
                    context.message.score = result.score;

                    if (this.onRecognizeCallback) {
                        this.onRecognizeCallback(context);
                    }
                    callback(null, result);
                }
                else {
                    callback(err, null);
                }
            })
        }
        else {
            callback(null, result);
        }
    };
}