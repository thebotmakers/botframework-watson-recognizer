"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var events_1 = require("events");
var WatsonRecognizer = (function (_super) {
    __extends(WatsonRecognizer, _super);
    function WatsonRecognizer(models, intentThreshold) {
        var _this = _super.call(this) || this;
        _this.models = models;
        _this.intentThreshold = intentThreshold;
        _this.conversationModels = {};
        _.each(models, function (model, key) {
            var conversation = new ConversationV1({
                username: model.username,
                password: model.password,
                version_date: ConversationV1.VERSION_DATE_2016_09_20
            });
            _this.conversationModels[key] = {
                workspaceId: model.workspaceId,
                conversation: conversation
            };
        });
        return _this;
    }
    ;
    WatsonRecognizer.prototype.recognize = function (context, callback) {
        var _this = this;
        // Disable bot responses to talk to human.
        if (context.message.user.handOff) {
            return;
        }
        var result = { score: 0.0, intent: null };
        if (context && context.message && context.message.text) {
            var textClean = context.message.text.replace(/(\r\n|\n|\r)/gm, " ");
            // get Locale model on Watson
            var locale = context.locale || 'es-ES';
            locale = _.split(locale, '-', 1);
            var conversationModel = this.conversationModels[locale];
            if (conversationModel) {
                conversationModel.conversation.message({
                    input: { text: textClean },
                    workspace_id: conversationModel.workspaceId
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
                        _this.emit('onRecognize', context);
                        callback(null, result);
                    }
                    else {
                        callback(err, null);
                    }
                });
            }
            else {
                callback(new Error("Watson model not found for locale '" + locale + "'."), null);
            }
        }
        else {
            callback(null, result);
        }
    };
    ;
    return WatsonRecognizer;
}(events_1.EventEmitter));
exports.WatsonRecognizer = WatsonRecognizer;
//# sourceMappingURL=index.js.map