import { OneRollDialogHelper } from "../utility/OREDialogHelper.js";

export default class OneRollActor extends Actor {
 
    /**
     * @override
     * stub at the moment
     */

    prepareBaseData(){
        super.prepareBaseData();

        const actorData = this.data; // actorData is "actor.data.data"

        // console.warn("prepareBaseData object: ", actorData);
        const data = actorData.data;
        const flags = actorData.flags;

        this._prepareCharacterData(actorData);
    }

    /**
    * @param actorData {EWActor} - this EWActor object's system-specific data
    * stub at the moment
    */
    _prepareCharacterData(actorData) {
        super.prepareDerivedData();
        const context = actorData.data;

        context.stats = ownedItems.filter(item => item.type == "stat");
        context.stats.foreach(stat => {
            let useForInit = stat.isInitStat;
            useForInit ? context.stat = stat.dice.base : context.stat = context.stat; 
        })

    }

    basicRoll() {
        console.warn("Basic Roll entered");
        OneRollDialogHelper.generateRollDialog();
    }

}