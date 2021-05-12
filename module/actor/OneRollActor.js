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
    }

    /**
    * @param actorData {EWActor} - this EWActor object's system-specific data
    * stub at the moment
    */
    _prepareCharacterData(actorData) {
        super.prepareDerivedData();
        const data = actorData.data;

    }

}