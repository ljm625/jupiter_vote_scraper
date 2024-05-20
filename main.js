import BrowserInstance from "./BrowserInstanceTemp.js";
import Notifier from "./Notifier.js";
import * as fs from "fs";
import * as yaml from "js-yaml";

function asyncsleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function load_config(config_file) {
    try {
        let fileContents = fs.readFileSync('./' + config_file, 'utf8');
        return yaml.load(fileContents);

    } catch (e) {
        console.log(e);
    }
}

async function main(){
    let url = "https://vote.jup.ag"
    let config = load_config("config.yaml")
    let notifier = new Notifier(config.telegram_bot_api,config.telegram_channel_id);
    let inst = new BrowserInstance(true)
    let page = await inst.start()
    await page.goto(url)
    await asyncsleep(1000);
    let old_proposals = {}
    try{
        let content = fs.readFileSync("proposals.json")
        if(content){
            old_proposals = JSON.parse(content)
        }
        console.log(old_proposals)
    } catch (e){
        console.log(e)

    }

    let result = await page.locator("tr.cursor-pointer");
    let count = await result.count();
    while(count==0){
        await asyncsleep(1000);
        result = await page.locator("tr.cursor-pointer");
        count = await result.count();
    }
    let proposals = {}
    for (let i = 0; i < count; i++) {
        let element = result.nth(i)
        let result1 = await element.locator("td")
        let count1 = await result1.count()
        let tmp_data= []
        for(let j =0;j<count1;j++){
            let inner = result1.nth(j)
            let text = await inner.textContent()
            tmp_data.push(text)
        }
        let proposal = {}
        proposal["name"]=tmp_data[0]
        proposal["status"]=tmp_data[2]
        proposal["start"]=tmp_data[4]
        proposal["end"]=tmp_data[5]
        proposals[tmp_data[0]]=proposal
    }
    console.log(proposals)
    let new_proposal_names =[]
    for(let proposal in proposals){
        console.log(proposal)
        if(!old_proposals[proposal]){
            console.log(`${proposal} is new`)
            new_proposal_names.push(proposal)
            notifier.notify(`#NewVote\n${proposal}\nhttps://vote.jup.ag`)
        }
    }
    await asyncsleep(5000)
    console.log(new_proposal_names)

    fs.writeFileSync("./proposals.json",JSON.stringify(proposals))

    process.exit(0)

    // let count = 20
    // let cur_index = 0
    // let items_count_old = 0
    // while (true){
    //     await page.mouse.wheel(0,1000+Math.floor(Math.random()*1000));
    //     await asyncsleep(3000+Math.floor(Math.random()*2000));
    //     cur_index+=1
    //     if(cur_index>count){
    //         if(items_count==items_count_old){
    //             console.log("We might be at the end of the page..")
    //             process.exit(0)
    //         }
    //         items_count_old = items_count
    //         console.log(`Parsed ${items_count} items`)
    //         cur_index = 0
    //         let file_info=""
    //         for(let item of items_library){
    //             let price = item.price
    //             let market_price = Number(item.showMarketPrice)*100
    //             let discount = price/market_price
    //             file_info+=`${item.c2cItemsId},${item.c2cItemsName},${item.price},${discount},${item.detailDtoList[0].skuId},https://mall.bilibili.com/neul-next/index.html?page=magic-market_detail&noTitleBar=1&itemsId=${item.c2cItemsId}\n`
    //         }
    //         fs.appendFileSync("./bilibili_data_up_100_20240411.csv",file_info)
    //         items_library=[]
    //         console.log("Items Saved to file complete")
    //     }
    // }






}

main()