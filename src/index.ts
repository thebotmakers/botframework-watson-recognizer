var ConversationV1 = require('watson-developer-cloud/conversation/v1');

export class WatsonRecognizer {

    models: {}
    conversation: any;

    constructor(private username: string, private password: string, private workspace: string) {
        
        this.conversation = new ConversationV1({
            username: username,
            password: password,
            version_date: ConversationV1.VERSION_DATE_2016_09_20
        });
    }

    public recognize(context, cb) {

        var result: any = { score: 0.0, intent: null };

        if (context && context.message && context.message.text) {

            var utterance = context.message.text;

            WatsonRecognizer.recognize(utterance, function (err, intents: any, entities) {

                if (!err) {
                    result.intents = intents;
                    result.entities = entities;
                    var top;
                    intents.forEach(function (intent) {
                        if (top) {
                            if (intent.score > top.score) {
                                top = intent;
                            }
                        }
                        else {
                            top = intent;
                        }
                    });
                    if (top) {
                        result.score = top.score;
                        result.intent = top.intent;
                        switch (top.intent.toLowerCase()) {
                            case 'builtin.intent.none':
                            case 'none':
                                result.score = 0.1;
                                break;
                        }
                    }
                    cb(null, result);
                }
                else {
                    cb(err, null);
                }

            }, this.conversation, this.workspace);
        }
        else {
            cb(null, result);
        }
    }

    //TODO: check why this is an static function, if is not used as such, make it a local function

    static recognize(utterance, callback, conversation, workspace) {

        try {

            conversation.message({
                input: { text: utterance },
                workspace_id: workspace
            }, (err, response) => {
               
                try {
                    if (!err) {
                        
                        let intents = (response.intents as Array<{intent, confidence}>) .map( i => ({ intent: i.intent, score:  i.confidence}))
                        let entities = response.entities.map(e => ({entity: e.value, type: e.entity}))

                        callback(null, intents, entities);
                    }
                    else {
                        var m = err.toString();
                        callback(err instanceof Error ? err : new Error(m));
                    }
                }
                catch (e) {
                    console.error(e.toString());
                }
            });
        }
        catch (err) {
            callback(err instanceof Error ? err : new Error(err.toString()));
        }
    }

}