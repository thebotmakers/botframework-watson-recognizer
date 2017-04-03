/// <reference types="node" />
import { IIntentRecognizer } from 'botbuilder';
import { EventEmitter } from 'events';
export interface IWatsonModel {
    username: string;
    password: string;
    workspaceId: string;
}
export interface IWatsonModelMap {
    [local: string]: IWatsonModel;
}
export declare class WatsonRecognizer extends EventEmitter implements IIntentRecognizer {
    private models;
    private conversationModels;
    private intentThreshold;
    constructor(models: IWatsonModelMap, intentThreshold: number);
    recognize(context: any, callback: any): void;
}
