import * as https from "https";

export default class Notifier{
    constructor(bot_token,channel) {
        this.token = bot_token;
        this.channel = channel;
    }

    notify(msg){
        let uri=`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${this.channel}&text=${encodeURIComponent(msg)}`
        const req = https.get(uri, res => {
            console.log(`statusCode: ${res.statusCode}`)
        })

    }
}

