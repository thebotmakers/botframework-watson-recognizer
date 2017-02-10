import { IIntentRecognizer } from 'botbuilder';
export declare class WatsonRecognizer implements IIntentRecognizer {
    private username;
    private password;
    private workspace;
    conversation: any;
    constructor(username: string, password: string, workspace: string);
    recognize(context: any, callback: any): void;
}
