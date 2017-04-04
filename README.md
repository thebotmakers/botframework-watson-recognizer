# botframework-watson-recognizer

> An Intent Recognizer to use IBM's Watson Conversation service with Misocroft's Bot Framework

[![NPM Version][npm-image]][npm-url]

## Install

```bash
npm i -S botframework-watson-recognizer
```

## Usage

Usage is the same as with LuisRecognizer, only Watson's service credential and Workspace Id are needed.

Now Watson recognizer has multi language support.

```ts
import { WatsonRecognizer, IWatsonModelMap, IWatsonModel } from 'botframework-watson-recognizer';

//Map all your language models here, you can set only one, it's ok
let watsonModelMap: IWatsonModelMap = {
    en: { username: '<user_en>', password: '<password_en>', workspaceId: '<workspace-id_en>' },
    es: { username: '<user_es>', password: '<password_es>', workspaceId: '<workspace-id_es>' }
};

let recognizer = new WatsonRecognizer(watsonModelMap, process.env.INTENT_THRESHOLD);

let intents = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog(`/`, intents)

intents.matches('greeting', '/greeting');
    
bot.dialog(`/greeting`,
    [
        (session: Session) => {
            session.send(`Hi!`)
            session.endDialog();
        }
    ]);
```

## NOTE

**This Recognizer only supports Intents and Entities extraction, Watson's Dialogs are not implemented yet.**

## Todo

- Unit tests
- MAYBE support Watson's Dialog 


## Check us out!

https://www.thebotmakers.com

## License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/botframework-watson-recognizer.svg
[npm-url]: https://npmjs.org/package/botframework-watson-recognizer