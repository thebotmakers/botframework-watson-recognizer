import { IIntentRecognizer } from 'botbuilder';
export declare class WatsonRecognizer implements IIntentRecognizer {
    private username;
    private password;
    private workspace;
    conversation: any;
    onRecognizeCallback: any;
    constructor(username: string, password: string, workspace: string);
    setCallback(onRecognizeCallback: any): void;
    recognize(context: any, callback: any): void;
}
