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
    WatsonRecognizer.prototype.recognize = function (context, callback) {
        var result = { score: 0.0, intent: null };
        if (context && context.message && context.message.text) {
            this.conversation.message({
                input: { text: context.message.text },
                workspace_id: this.workspace
            }, function (err, response) {
                if (!err) {
                    // map entities to botbuilder format
                    result.entities = response.entities.map(function (e) { return ({ type: e.entity, entity: e.value, startIndex: e.location[0], endIndex: e.location[1] }); });
                    // map intents to botbuilder format
                    result.intents = response.intents.map(function (i) { return ({ intent: i.intent, score: i.confidence }); });
                    var top_1 = result.intents.sort(function (a, b) { return a.score - b.score; })[0];
                    result.score = top_1.score;
                    result.intent = top_1.intent;
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
    return WatsonRecognizer;
}());
exports.WatsonRecognizer = WatsonRecognizer;
//# sourceMappingURL=index.js.map