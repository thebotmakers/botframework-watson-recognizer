export declare class WatsonRecognizer {
    private username;
    private password;
    private workspace;
    models: {};
    conversation: any;
    constructor(username: string, password: string, workspace: string);
    recognize(context: any, cb: any): void;
    static recognize(utterance: any, callback: any, conversation: any, workspace: any): void;
}
