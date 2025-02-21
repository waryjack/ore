export default class OneRollItem extends Item {

     /** @override */
     getRollData() {
        const rollData = this.system ?? {};
        return rollData;
    }

    /** @override */
    prepareDerivedData() {
        super.prepareDerivedData()
    }

}