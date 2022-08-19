import { OneRollDialogHelper } from "../utility/OREDialogHelper.js";

export default class OneRollActor extends Actor {
 
    /**
     * @override
     * stub at the moment
     */

    prepareBaseData(){
        super.prepareBaseData();

        const charStats = this.system; // actorData is "actor.data.data"

        // console.warn("prepareBaseData object: ", actorData);
    
        if(this.type === "major" || this.type === "minor") {
            this._prepareCharacterData(charStats);
        } else {
            this._prepareSquadData(charStats);
        }
        
    }

    /**
    * @param actorData {EWActor} - this EWActor object's system-specific data
    * stub at the moment
    */
    _prepareCharacterData(charStats) {
        super.prepareDerivedData();
        

    }

    basicRoll() {
        console.warn("Basic Roll entered");
        OneRollDialogHelper.generateRollDialog();
    }

}