import * as path from 'path'
import axios from "axios";
import playwright, { devices } from 'playwright'; // import devices


export default class BrowserInstance{

    constructor(headless=false) {
        this.browser = null
        this.headless =headless
        this.stealth_url = "https://cdn.jsdelivr.net/gh/requireCool/stealth.min.js/stealth.min.js"

    }

    async start() {
        let args = []
        let device = devices["iPhone 13 Pro Max"]
        if(this.headless){
            args.push("--headless=new")
        }
        this.browser = await playwright.chromium.launch(
            {
                headless: false,
                args: args,
            },
        );
        // let backgrounds_v2 = this.browser.backgroundPages()
        // let backgrounds = this.browser.serviceWorkers();
        //
        // const extensionId = backgrounds[0].url().split('/')[2];
        let page = await this.browser.newPage()

        let resp = await axios.get(this.stealth_url)
        await page.addInitScript(resp.data)
        return page
    }

}