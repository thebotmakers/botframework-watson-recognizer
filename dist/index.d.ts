import { IIntentRecognizer } from 'botbuilder';
export interface IWatsonModel {
    username: string;
    password: string;
    workspaceId: string;
}
export interface IWatsonModelMap {
    [local: string]: IWatsonModel;
}
export declare class WatsonRecognizer implements IIntentRecognizer {
    private models;
    onRecognizeCallback: any;
    private conversationModels;
    private intentThreshold;
    constructor(models: IWatsonModelMap, intentThreshold: number);
    setCallback(onRecognizeCallback: any): void;
    recognize(context: any, callback: any): void;
}
