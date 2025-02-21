export default class OneRollBaseItem extends Item {
    

    /** @override */
    getRollData() {
        const rollData = this.system ?? {};
        return rollData;
    }

    /** @override */
    prepareDerivedData() {
        super.prepareDerivedData()
    }

    adjustPool(dir) {
       // console.warn("Item adjustPool fired");
        let sys = this.system;
        let max = sys.max_points;
        let min = sys.min_points;
        let cur = sys.curr_points;

       // console.warn("Direction", dir);
        if(dir == "inc") {
            cur++;
            sys.curr_points = Math.min(cur, max);
        } else if (dir == "dec") {
            cur--;
            sys.curr_points = Math.max(cur, min);
        } else {
            return;
        }
       // console.warn("sys.curr_points: ", sys.curr_points);
        this.update({"system":sys});
        //console.warn("after changes: ", this);
    }
}