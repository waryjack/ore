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
        
        let hitlocArray = ["head","torso","vitals","larm","rarm","lleg","rleg"];
        let finalStateArray = [];
        hitlocArray.forEach(function(element) {
            let stateArray = charStats.hitlocs[element].boxstates;
            let stateCount = charStats.hitlocs[element].box_max;
            if(stateArray.length == 0) {
                for(let i = 0; i < stateCount; i++) {
                    stateArray.push("h");
                }
                finalStateArray = stateArray;
            } else {
                finalStateArray = stateArray;
            }
            // console.warn("Location: ", element, "State Array: ", finalStateArray);
            setProperty(charStats, `hitlocs.${element}.boxstates`, finalStateArray);
        });



    }

    basicRoll() {
        console.warn("Basic Roll entered");
        OneRollDialogHelper.generateRollDialog();
    }

}