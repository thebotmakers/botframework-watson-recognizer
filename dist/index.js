"use strict";
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var WatsonRecognizer = (function () {
    function WatsonRecognizer(username, password, workspace) {
        this.username = username;
        this.password = password;
        this.workspace = workspace;
        this.conversation = new ConversationV1({
            username: username,
            password: password,
            version_date: ConversationV1.VERSION_DATE_2016_09_20
        });
    }
    WatsonRecognizer.prototype.recognize = function (context, cb) {
        var result = { score: 0.0, intent: null };
        if (context && context.message && context.message.text) {
            var utterance = context.message.text;
            WatsonRecognizer.recognize(utterance, function (err, intents, entities) {
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
    };
    //TODO: check why this is an static function, if is not used as such, make it a local function
    WatsonRecognizer.recognize = function (utterance, callback, conversation, workspace) {
        try {
            conversation.message({
                input: { text: utterance },
                workspace_id: workspace
            }, function (err, response) {
                try {
                    if (!err) {
                        var intents = response.intents.map(function (i) { return ({ intent: i.intent, score: i.confidence }); });
                        var entities = response.entities.map(function (e) { return ({ entity: e.value, type: e.entity }); });
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
    };
    return WatsonRecognizer;
}());
exports.WatsonRecognizer = WatsonRecognizer;
//# sourceMappingURL=index.js.map