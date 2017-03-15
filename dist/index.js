"use strict";
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var WatsonRecognizer = (function () {
    function WatsonRecognizer(username, password, workspace, intentThreshold) {
        this.username = username;
        this.password = password;
        this.workspace = workspace;
        this.intentThreshold = intentThreshold;
        this.conversation = new ConversationV1({
            username: username,
            password: password,
            version_date: ConversationV1.VERSION_DATE_2016_09_20
        });
    }
    ;
    WatsonRecognizer.prototype.setCallback = function (onRecognizeCallback) {
        this.onRecognizeCallback = onRecognizeCallback;
    };
    ;
    WatsonRecognizer.prototype.recognize = function (context, callback) {
        // Disable bot responses to talk to human.
        var _this = this;
        if (context.message.user.handOff) {
            return;
        }
        var result = { score: 0.0, intent: null };
        if (context && context.message && context.message.text) {
            var textClean = context.message.text.replace(/(\r\n|\n|\r)/gm, " ");
            this.conversation.message({
                input: { text: textClean },
                workspace_id: this.workspace
            }, function (err, response) {
                if (!err) {
                    // map entities to botbuilder format
                    result.entities = response.entities.map(function (e) { return ({ type: e.entity, entity: e.value, startIndex: e.location[0], endIndex: e.location[1] }); });
                    // map intents to botbuilder format
                    result.intents = response.intents.map(function (i) { return ({ intent: i.intent, score: i.confidence }); });
                    var top_1 = result.intents.sort(function (a, b) { return a.score - b.score; })[0];
                    //filter intents with less than intentThreshold
                    result.score = top_1.score < _this.intentThreshold ? 0 : top_1.score;
                    result.intent = top_1.intent;
                    //Add intent and score to message object
                    context.message.intent = result.intent;
                    context.message.score = result.score;
                    if (_this.onRecognizeCallback) {
                        _this.onRecognizeCallback(context);
                    }
                    callback(null, result);
                }
                else {
                    callback(err, null);
                }
            });
        }
        else {
            callback(null, result);
        }
    };
    ;
    return WatsonRecognizer;
}());
exports.WatsonRecognizer = WatsonRecognizer;
//# sourceMappingURL=index.js.map